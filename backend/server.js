const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { randomUUID } = require('node:crypto');
require('dotenv').config();

const supabase = require('./supabase');

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Multer — in-memory storage for image uploads
const upload = multer({ storage: multer.memoryStorage() });

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'fitto-api', timestamp: new Date().toISOString() });
});

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY ROUTES — kept for backwards compatibility with existing frontend code
// ═══════════════════════════════════════════════════════════════════════════════

// In-memory exercise list (still used by frontend workout generator)
const exercises = [
  { id: 'pushup', name: 'Push-ups', tags: ['upper'], equipment: 'none', type: 'reps' },
  { id: 'squat', name: 'Bodyweight squats', tags: ['lower'], equipment: 'none', type: 'reps' },
  { id: 'plank', name: 'Plank hold', tags: ['core'], equipment: 'none', type: 'duration' },
  { id: 'burpee', name: 'Burpees', tags: ['fullbody', 'cardio'], equipment: 'none', type: 'reps' },
  { id: 'dbgoblet', name: 'Dumbbell goblet squat', tags: ['lower'], equipment: 'dumbbells', type: 'reps' },
  { id: 'dbrow', name: 'Dumbbell bent-over row', tags: ['upper'], equipment: 'dumbbells', type: 'reps' },
  { id: 'kbswing', name: 'Kettlebell swing', tags: ['fullbody', 'cardio'], equipment: 'kettlebell', type: 'reps' },
];

app.get('/api/exercises', (req, res) => {
  const { equipment } = req.query;
  const result = equipment
    ? exercises.filter(ex => ex.equipment === 'none' || ex.equipment === equipment)
    : exercises;
  res.json({ exercises: result });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHAT (Groq AI) — unchanged from original
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, personality } = req.body;
    if (!messages) return res.status(400).json({ error: 'Missing messages array' });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured in the environment.' });
    }

    const tone = personality || 'Motivator';
    const systemPrompt = `You are FITTO Assistant, an elite, adaptive fitness expert and coach. Your tone is ${tone}. Keep your responses concise, highly actionable, and focused on fitness, recovery, and wellness. Do not use formatting like bolding or italics excessively.`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : m.role, content: m.text })),
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      throw new Error(`Groq API error: ${errText}`);
    }

    const groqData = await groqResponse.json();
    const replyText = groqData.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
    res.json({ reply: replyText });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE UPLOAD — Supabase Storage (bucket: "uploads")
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/posts/upload
 * Uploads an image file to the Supabase Storage "uploads" bucket.
 * Returns the public URL of the uploaded image.
 */
app.post('/api/posts/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = path.extname(req.file.originalname);
    const fileName = `post-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
    res.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMMUNITY — POSTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/posts?userId=<uuid>
 * Returns all posts with author profile info, comments, and like counts.
 * Optionally pass userId to know which posts the current user has liked.
 */
app.get('/api/posts', async (req, res) => {
  try {
    const { userId } = req.query;

    // Step 1: Fetch posts with comments and likes (no profile JOIN needed)
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, content, tag, image_url, created_at, user_id, comments(id, content, created_at, user_id), likes(user_id)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Step 2: Fetch profiles for all unique user_ids in posts + comments
    const allUserIds = new Set();
    posts.forEach(p => {
      allUserIds.add(p.user_id);
      (p.comments || []).forEach(c => allUserIds.add(c.user_id));
    });

    let profileMap = {};
    if (allUserIds.size > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', [...allUserIds]);
      profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));
    }

    const formatted = posts.map(post => {
      const author = profileMap[post.user_id];
      const likesCount = post.likes ? post.likes.length : 0;
      const userLiked = userId && post.likes
        ? post.likes.some(l => l.user_id === userId)
        : false;

      return {
        id: post.id,
        user_id: post.user_id,
        author: author?.name || 'FITTO Member',
        avatar: (author?.name || 'FM').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
        content: post.content,
        tag: post.tag || 'Workout',
        image_url: post.image_url || null,
        time: new Date(post.created_at).toLocaleString(),
        likes: likesCount,
        liked: userLiked,
        comments: (post.comments || []).map(c => {
          const cAuthor = profileMap[c.user_id];
          return {
            id: c.id,
            author: cAuthor?.name || 'Member',
            text: c.content,
            time: new Date(c.created_at).toLocaleString(),
          };
        }),
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/posts
 * Creates a new community post.
 * Body: { user_id, content, tag, image_url? }
 */
app.post('/api/posts', async (req, res) => {
  try {
    const { user_id, content, tag, image_url } = req.body;
    if (!user_id || !content) {
      return res.status(400).json({ error: 'user_id and content are required' });
    }

    // Step 1: Insert the post (no JOIN in select)
    const { data: newPost, error } = await supabase
      .from('posts')
      .insert([{ user_id, content, tag: tag || 'Workout', image_url: image_url || null }])
      .select('id, content, tag, image_url, created_at, user_id')
      .single();

    if (error) throw error;

    // Step 2: Fetch author name from profiles
    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user_id)
      .maybeSingle();

    const authorName = authorProfile?.name || 'FITTO Member';
    res.status(201).json({
      id: newPost.id,
      user_id: newPost.user_id,
      author: authorName,
      avatar: authorName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
      content: newPost.content,
      tag: newPost.tag,
      image_url: newPost.image_url,
      time: new Date(newPost.created_at).toLocaleString(),
      likes: 0,
      liked: false,
      comments: [],
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/posts/:id
 * Deletes a post if the requesting user is the author.
 * Body: { user_id }
 */
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });

    // Verify ownership
    const { data: post, error: fetchErr } = await supabase
      .from('posts')
      .select('user_id, image_url')
      .eq('id', id)
      .single();

    if (fetchErr || !post) return res.status(404).json({ error: 'Post not found' });
    if (post.user_id !== user_id) return res.status(403).json({ error: 'Unauthorized' });

    // Delete image from storage if exists
    if (post.image_url) {
      const fileName = post.image_url.split('/').pop();
      await supabase.storage.from('uploads').remove([fileName]);
    }

    const { error: deleteErr } = await supabase.from('posts').delete().eq('id', id);
    if (deleteErr) throw deleteErr;

    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMMUNITY — LIKES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/posts/:id/like
 * Toggles a like on a post.
 * Body: { user_id }
 */
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const post_id = req.params.id;
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });

    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', post_id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (existing) {
      await supabase.from('likes').delete().eq('id', existing.id);
      res.json({ liked: false });
    } else {
      await supabase.from('likes').insert([{ post_id, user_id }]);
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMMUNITY — COMMENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/posts/:id/comment
 * Adds a comment to a post.
 * Body: { user_id, content }
 */
app.post('/api/posts/:id/comment', async (req, res) => {
  try {
    const post_id = req.params.id;
    const { user_id, content } = req.body;
    if (!user_id || !content) {
      return res.status(400).json({ error: 'user_id and content are required' });
    }

    // Step 1: Insert comment (no JOIN in select)
    const { data: newComment, error } = await supabase
      .from('comments')
      .insert([{ post_id, user_id, content }])
      .select('id, content, created_at, user_id')
      .single();

    if (error) throw error;

    // Step 2: Get author name from profiles
    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user_id)
      .maybeSingle();

    res.status(201).json({
      id: newComment.id,
      author: authorProfile?.name || 'FITTO Member',
      text: newComment.content,
      time: new Date(newComment.created_at).toLocaleString(),
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: error.message });
  }
});


// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏋️  Fitto API running at http://localhost:${PORT}`);
  console.log(`   • POST /api/posts/upload   — image upload`);
  console.log(`   • GET  /api/posts          — community feed`);
  console.log(`   • POST /api/posts          — create post`);
  console.log(`   • POST /api/posts/:id/like    — toggle like`);
  console.log(`   • POST /api/posts/:id/comment — add comment`);
  console.log(`   • POST /api/chat           — AI coach\n`);
});

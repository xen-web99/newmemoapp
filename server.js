const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// --- Supabaseの設定 ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nfoquzypjjlvqmscimwi.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mb3F1enlwampsdnFtc2NpbXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjY1MTgsImV4cCI6MjA3ODQwMjUxOH0.2tLnWKdGiEFNZJDm777Zr1q9JrNNRgRiqzBEUikyZ_M';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- メモ一覧を取得 ---
app.get('/api/memos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching memos:', error);
    res.status(500).json({ error: 'Failed to fetch memos' });
  }
});

// --- メモを追加 ---
app.post('/api/memos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('memos')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.json({ message: 'saved', memo: data[0] });
  } catch (error) {
    console.error('Error saving memo:', error);
    res.status(500).json({ error: 'Failed to save memo' });
  }
});

// --- メモを削除 ---
app.delete('/api/memos/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('memos')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ message: 'deleted' });
  } catch (error) {
    console.error('Error deleting memo:', error);
    res.status(500).json({ error: 'Failed to delete memo' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
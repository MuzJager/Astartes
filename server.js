const express = require('express');
const app = express();
const PORT = 4000;

let notes = [];
let currentId = 1;

app.use(express.json());

app.get('/notes', (req, res) => {
    if (notes.length === 0) {
        return res.status(404).json({ message: 'Список заметок пуст' });
    }
    res.status(200).json(notes);
});

app.get('/note/:id', (req, res) => {
    const note = notes.find((n) => n.id === parseInt(req.params.id));
    if (!note) {
        return res.status(404).json({ message: 'Заметка не найдена' });
    }
    res.status(200).json(note);
});

app.get('/note/read/:title', (req, res) => {
    const note = notes.find((n) => n.title === req.params.title);
    if (!note) {
        return res.status(404).json({ message: 'Заметка не найдена' });
    }
    res.status(200).json(note);
});

app.post('/note', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Поля 'title' и 'content' обязательны" });
    }

    const newNote = {
        id: currentId++,
        title,
        content,
        created: new Date(),
        changed: new Date(),
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});

app.delete('/note/:id', (req, res) => {
    const noteIndex = notes.findIndex((n) => n.id === parseInt(req.params.id));
    if (noteIndex === -1) {
        return res.status(404).json({ message: 'Заметка не найдена' });
    }

    notes.splice(noteIndex, 1);
    res.status(204).send();
});

app.put('/note/:id', (req, res) => {
    const { title, content } = req.body;
    const note = notes.find((n) => n.id === parseInt(req.params.id));

    if (!note) {
        return res.status(404).json({ message: 'Заметка не найдена' });
    }

    if (!title && !content) {
        return res.status(400).json({ message: "Должно быть обновлено хотя бы одно из полей 'title' или 'content'" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    note.changed = new Date();

    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// Быстрая справка по использованию
//  Получить все заметки
// curl -X GET http://localhost:4000/notes

//  Получить заметку по ID (замените {id} на реальный ID заметки)
// curl -X GET http://localhost:4000/note/{id}

//  Получить заметку по названию (замените {title} на реальное название заметки)
// curl -X GET http://localhost:4000/note/read/{title}

//  Создать новую заметку
// curl -X POST http://localhost:4000/note -H "Content-Type: application/json" -d "{\"title\": \"Название заметки\", \"content\": \"Содержимое заметки\"}"

//  Обновить существующую заметку по ID (замените {id} на реальный ID заметки)
// curl -X PUT http://localhost:4000/note/{id} -H "Content-Type: application/json" -d "{\"title\": \"Обновленное название\", \"content\": \"Обновленное содержимое\"}"

//  Удалить заметку по ID (замените {id} на реальный ID заметки)
// curl -X DELETE http://localhost:4000/note/{id}
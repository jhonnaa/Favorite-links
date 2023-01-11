const express = require('express')
const router = express.Router();

const {isLogedIn} = require('../lib/auth')
const pool = require('../database')
router.get('/add', (req,res)=>{
    res.render('./links/add')
})

router.post('/add',isLogedIn , async (req,res)=>{
    const {title, url , description}=req.body;
    const newLink={
        title,
        url,
        description,
        user_id :req.user.id
    };
    console.log(newLink)
    await pool.query('INSERT INTO links set ?',[newLink]);
    req.flash('success', 'Link saved succsessfuly');
    res.redirect('/links')
})


router.get('/',isLogedIn,async (req, res)=>{
    const links = await pool.query('SELECT * FROM links WHERE user_id = ? ' ,[req.user.id]);
    console.log(links)
    res.render('./links/list',{links})
})

router.get('/delete/:id' ,isLogedIn, async (req, res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM links WHERE ID= ?',[id]);
    req.flash('success','Link removed successfuly');
    res.redirect('/links')
});


router.get('/edit/:id', isLogedIn,async(req, res)=>{
    const {id} = req.params;
    
    const links = await pool.query('SELECT * FROM links WHERE ID= ?',[id]);
    res.render('links/edit', {link:links[0]})
})
router.post('/edit/:id',isLogedIn, async(req,res)=>{
    const {id}= req.params;
    const {title, description, url} = req.body
    const newLink={
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?',[newLink, id])
    req.flash('success','Link updated successfuly');
    res.redirect('/links')
})

module.exports =  router
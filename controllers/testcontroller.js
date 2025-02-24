const Test= require('../model/Admin') //importing a model

// create function to get all test users
const getTest = async (requestAnimationFrame, res) => {
    try{
        const tests = await Test.findAll();
        res.status(200).json(tests);
        console.log('Retrive all test users');
    }
    catch (error) {
        res.status(500).json({error: 'Failed to retrive test data'});
    }
}

// create functions to create Test Users
const createTest = async (req, res)=> {
    try{
        const {username, password} = req.body;
        const newtest = await Test.create({username, password})
        res.status(200).json(newtests);
        console.log('New Test user created');
    }
    catch (error) {
        res.status(500).json({error: 'Failed to create test user'});
    }
}

module.exports = {getTest, createTest};

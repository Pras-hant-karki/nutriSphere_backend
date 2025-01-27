const { Sequelize } = require("sequelize");


const sequelize= new Sequelize('Nutrisphere','postgres','admin123',{
    host:'localhost',
    dialect:'postgres',
    port: 5432,
    logging: false,
})


async function Conn() {

    try{
        await sequelize.authenticate();
        console.log('Database connection sucessful...................................')
    }
    catch(error){
        console.error('Unable to connect to the database.......................',error)
    }

}
Conn()

module.exports=sequelize;
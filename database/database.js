const { Sequelize } = require("sequelize");


const sequelize= new Sequelize('Nutrisphere','postgres','CarbonKurt33',{
    host:'localhost',
    dialect:'postgres',
    port: 5432,
    logging: false,
})



module.exports=sequelize;
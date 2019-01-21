// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port: 3306,
      user : 'local',
      password : 'local',
      database : 'node_inventory',
      socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
    }
  }
  
};


exports.up = function(knex) {
  return knex.schema.createTable('protocols', function(table) {
    table.increments('id').unsigned().primary()
    table.string('peerId').notNullable()
    table.string('name').notNullable()
    table.json('config')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('protocols');
};
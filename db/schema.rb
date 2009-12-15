# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20091215050225) do

  create_table "actions", :force => true do |t|
    t.string   "type"
    t.string   "position"
    t.string   "player"
    t.integer  "before_id"
    t.integer  "after_id"
    t.integer  "game_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "cardinality"
    t.integer  "captured_stones", :default => 0
  end

  create_table "boards", :force => true do |t|
    t.integer  "dimension"
    t.string   "array_hack", :default => "", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "games", :force => true do |t|
    t.string   "state"
    t.integer  "current_board_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "black_id"
    t.integer  "white_id"
    t.string   "to_play"
    t.integer  "captured_whites",  :default => 0
    t.integer  "captured_blacks",  :default => 0
  end

  create_table "secrets", :force => true do |t|
    t.integer  "user_id"
    t.integer  "target_id"
    t.string   "target_type", :default => "Game"
    t.string   "secret"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end

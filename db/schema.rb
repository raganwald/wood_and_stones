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

ActiveRecord::Schema.define(:version => 20100322210847) do

  create_table "actions", :force => true do |t|
    t.string   "type"
    t.string   "position"
    t.string   "player"
    t.text     "after_board_serialized",  :limit => 3249
    t.integer  "dimension"
    t.integer  "game_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "cardinality"
    t.text     "removed_serialized",      :limit => 255
    t.text     "before_board_serialized", :limit => 3249
  end

  add_index "actions", ["game_id", "cardinality"], :name => "index_actions_on_game_id_and_cardinality"
  add_index "actions", ["id"], :name => "index_actions_on_id"

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.string   "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "games", :force => true do |t|
    t.string   "state"
    t.text     "initial_board_serialized",   :limit => 3249
    t.text     "current_board_serialized",   :limit => 3249
    t.integer  "dimension"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "black_id"
    t.integer  "white_id"
    t.string   "to_play"
    t.integer  "captured_whites",                            :default => 0
    t.integer  "captured_blacks",                            :default => 0
    t.integer  "current_move_number",                        :default => 0
    t.text     "current_removed_serialized", :limit => 3249
    t.integer  "last_black_notification"
    t.integer  "last_white_notification"
  end

  add_index "games", ["id"], :name => "index_games_on_id"

  create_table "secrets", :force => true do |t|
    t.integer  "user_id"
    t.integer  "target_id"
    t.string   "target_type", :default => "Game"
    t.string   "secret"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "secrets", ["secret"], :name => "index_secrets_on_secret"

  create_table "users", :force => true do |t|
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["id"], :name => "index_users_on_id"

end

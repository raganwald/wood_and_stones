class AddNotificationColumns < ActiveRecord::Migration
  def self.up
    add_column :games, :last_black_notification, :integer
    add_column :games, :last_white_notification, :integer
  end

  def self.down
    remove_column :games, :last_white_notification
    remove_column :games, :last_black_notification
  end
end

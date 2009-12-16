class CreateNotificationQueueTable < ActiveRecord::Migration
  def self.up
    create_table :notifications, :force => true do |t|
      t.string :type
      t.integer :recipient_id
      t.references :subject, :polymorphic => { :default => 'Secret' }
      t.datetime :sent
      t.timestamps
    end
  end

  def self.down
    drop_table :notifications
  end
end

class CreateSecretTable < ActiveRecord::Migration
  def self.up
    create_table :secrets, :force => true do |t|
      t.references :user
      t.references :target, :polymorphic => { :default => 'Game' }
      t.string :secret
      t.timestamps
    end
  end

  def self.down
    drop_table :secrets
  end
end

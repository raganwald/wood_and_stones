class Notification::Base < ActiveRecord::Base
  set_table_name(:notifications)
  belongs_to(:recipient, :class_name => "User", :foreign_key => "recipient_id")
  belongs_to(:subject, :polymorphic => (true))
  validates_presence_of(:recipient, :on => :create, :message => "can't be blank")
end
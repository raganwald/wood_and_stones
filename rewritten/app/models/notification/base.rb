class Notification::Base < ActiveRecord::Base
  set_table_name(:notifications)
  belongs_to(:user)
  belongs_to(:subject, :polymorphic => (true))
  validates_presence_of(:user, :on => :create, :message => "can't be blank")
end
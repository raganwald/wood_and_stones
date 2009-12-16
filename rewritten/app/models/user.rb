class User < ActiveRecord::Base
  validates_uniqueness_of(:email, :on => :create, :message => "must be unique")
  has_many(:notifications, :foreign_key => "recipient_id")
end
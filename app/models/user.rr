class User < ActiveRecord::Base
  validates_uniqueness_of :email, :on => :create, :message => "must be unique"
end

class Secret < ActiveRecord::Base
  belongs_to(:user)
  belongs_to(:target, :polymorphic => (true))
  validates_uniqueness_of(:secret)
  validates_presence_of(:secret)
  before_validation_on_create(:assign_secret)
  def assign_secret
    self.secret = (__126054736594094__ = (1000000 + rand(9999999))
    if __126054736594094__.kind_of?(Fixnum) then
      RewriteRails::ExtensionMethods::Fixnum.shortened(__126054736594094__)
    else
      __126054736594094__.shortened
    end)
    true
  end
end
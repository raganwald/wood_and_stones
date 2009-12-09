class SecretController < ApplicationController
  def go
    ((its = Secret.find_by_secret(params[:secret]) and (self.current_user = its.user
    redirect_to(:controller => (its.target.class), :action => :show, :id => (its.target.id)))) or render(:status => 404))
  end
end
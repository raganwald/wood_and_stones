module Authenticatable
  module ControllerMethods
    protected
    def self.included(base)
      base.helper_method(:current_user, :logged_in?, :authorized?, :admin?)
    end
    def current_user
      @current_user ||= (it = session[:user_id] and User.find_by_id(it))
    end
    def current_user=(user)
      if user.is_a?(User) then
        @current_user = user
        session[:user_id] = @current_user.id
      else
        logout_current_user!
      end
    end
    def authenticate
      (logged_in? and authorized?) ? (true) : (access_denied)
    end
    def authenticate_with_cookies
      return if (logged_in? or cookies[:auth_token].nil?)
      self.current_user = User.find_by_remember_token(cookies[:auth_token])
    end
    def logged_in?
      current_user
    end
    def admin?
      false
    end
    def authorized?
      true
    end
    def remember_current_user
      if (logged_in? and current_user.respond_to?(:remember)) then
        current_user.remember
        cookies[:auth_token] = { :value => (current_user.remember_token), :expires => (current_user.remember_token_expires_at) }
      end
    end
    def logout_current_user!
      begin
        current_user.try(:forget) rescue nil
        ensure
          (@current_user = nil
          cookies.delete(:auth_token)
          reset_session)
      end
    end
    def access_denied
      response_for_access_denied
      return false
    end
    def response_for_access_denied
      respond_to do |format|
        format.html do
          store_location
          flash.now[:notice] = unauthorized_message
          redirect_to(new_session_url)
        end
        format.all { redirect_to(new_session_url) }
      end
    end
    def store_location
      session[:return_to] = logged_in? ? (nil) : (request.request_uri)
    end
    def unauthorized_message
      "Please use your login URL"
    end
    def redirect_back_or_to(options)
      if session[:return_to] then
        redirect_to(session[:return_to])
      else
        redirect_to(options)
      end
      session[:return_to] = nil
    end
    def authenticate_with_http_basic(&login_procedure)
      if authorization = (request.env["HTTP_AUTHORIZATION"] or request.env["X-HTTP_AUTHORIZATION"]) then
        login_procedure.call(*Base64.decode64(authorization.split.last).split(/:/, 2))
      end
    end
  end
end
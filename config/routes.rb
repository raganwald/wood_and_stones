ActionController::Routing::Routes.draw do |map|
  # The priority is based upon order of creation: first created -> highest priority.

  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller
  
  # Sample resource route with more complex sub-resources
  #   map.resources :products do |products|
  #     products.resources :comments
  #     products.resources :sales, :collection => { :recent => :get }
  #   end

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/game/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.
  # map.root :controller => "welcome"

  # See how all your routes lay out with "rake routes"
  
  map.root        :controller => 'game', :action => 'new'
  
  map.show_game   '/:secret', :controller => 'game', :action => 'show'
  map.create_game '/game/create', :controller => 'game', :action => 'create'
  
  map.move_info   'game/:game_id/info', :controller => 'action/gameplay', :action => 'info', :method => 'GET'
  map.get_history 'game/:game_id/plays_before/:before_play', :controller => 'action/gameplay', :action => 'index', :method => 'GET'
  map.get_updates 'game/:game_id/plays_after/:after_play', :controller => 'action/gameplay', :action => 'index', :method => 'GET'
  map.plays       'game/:game_id/plays', :controller => 'action/gameplay', :action => 'index', :method => 'GET'
  
  map.create_move 'move/create/:game_id/:position', :controller => 'action/move', :action => 'create', :method => 'POST'
  map.create_pass 'pass/create/:game_id', :controller => 'action/pass', :action => 'create', :method => 'POST'
  
  map.board_image_paths 'board/image_paths', :controller => 'board', :action => 'image_paths'

  # Install the default routes as the lowest priority.
  # Note: These default routes make all actions in every controller accessible via GET requests. You should
  # consider removing the them or commenting them out if you're using named routes and resources.
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
  
end

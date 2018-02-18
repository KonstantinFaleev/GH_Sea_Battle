Rails.application.routes.draw do

  root 'game#index'

  resources :game
  resources :ship

end

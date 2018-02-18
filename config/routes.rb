Rails.application.routes.draw do

  root 'game#show'

  get 'game/show'

  get 'game/create'

  get 'game/move'

  get 'game/win'

  resources :ship2
  resources :ship

end

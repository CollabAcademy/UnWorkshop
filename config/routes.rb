Rails.application.routes.draw do
  get 'auth/google_oauth2/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'signout', to: 'sessions#destroy', as: 'signout'

  resources :sessions, only: [:create, :destroy]

  root to: "home#show"

  # admin dashboard
  namespace :admin do
    get '/dashboard' , to: 'dashboard#home'
  end

end

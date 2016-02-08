class Admin::BaseController < ApplicationController
  before_action :ensure_loggedin!
  before_action :ensure_admin!
end

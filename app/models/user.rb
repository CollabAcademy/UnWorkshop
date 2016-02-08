# t.string :provider
# t.string :uid
# t.string :name
# t.string :email
# t.string :oauth_token
# t.datetime :oauth_expires_at
# t.boolean :admin, default: false

class User < ActiveRecord::Base
  def initialize()
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_initialize.tap do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name
      user.email = auth.info.email
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      user.save!
    end
  end

  def admin?
    self.admin
  end
end

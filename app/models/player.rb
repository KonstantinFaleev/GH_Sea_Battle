class Player < ActiveRecord::Base
  has_secure_password
  has_many :victories, :foreign_key => 'winner_id', :class_name => 'Game'
  has_many :defeats, :foreign_key => 'looser_id', :class_name => 'Game'
  has_many :boards
  has_many :comments

  acts_as_paranoid

  default_scope -> { order('rating DESC') }
  before_save { self.email = email.downcase }
  before_create :create_remember_token

  validates :name, presence: true, length: { in: 3..20 },
            uniqueness: { case_sensitive: false }

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
  validates :email, allow_blank: true, format: { with: VALID_EMAIL_REGEX }

  validates :password, length: { minimum: 6 }

  def Player.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def Player.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  def self.search(search)
    if search
      find(:all, :conditions => ['lower(name) LIKE ?', "%#{search.downcase}%"])
    else
      find(:all)
    end
  end

  def online?
    updated_at > 10.minutes.ago
  end

  private

  def create_remember_token
    self.remember_token = Player.encrypt(Player.new_remember_token)
  end
end
end

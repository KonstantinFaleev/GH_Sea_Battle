class Player

  has_secure_password

  validates :name, presence: true, length: { in: 3..20 },
            uniqueness: { case_sensitive: false }

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
  validates :email, allow_blank: true, format: { with: VALID_EMAIL_REGEX }

  validates :password, length: { minimum: 6 }
end
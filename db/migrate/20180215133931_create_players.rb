class CreatePlayers < ActiveRecord::Migration[5.1]
  def change
    create_table :players, :force => true do |t|
      t.string   :name
      t.string   :email
      t.string   :password_digest
      t.string   :remember_token
      t.integer  :rating, default: 0
      t.integer  :ships_lost, default: 0
      t.integer  :ships_destroyed, default: 0
      t.boolean  :admin, default: false
      t.datetime :last_response_at

      t.timestamps
    end
  end
end

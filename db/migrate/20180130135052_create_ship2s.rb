class CreateShip2s < ActiveRecord::Migration[5.1]
  def change
    create_table :ship2s do |t|
      t.integer :x
      t.integer :y
      t.string :status

      t.timestamps
    end
  end
end

class CreateBoards < ActiveRecord::Migration[5.1]
  def change
    create_table :boards, :force => true do |t|
      t.integer  :player_id
      t.text     :grid
      t.text     :available_ships
      t.boolean  :direction, default: false
      t.boolean  :saved, default: false
      t.string   :title, default: "No title"
      t.timestamps
    end
  end
end

class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :game, :force => true do |t|
      t.integer  :player_a_id
      t.integer  :player_b_id
      t.integer  :winner_id
      t.integer  :looser_id
      t.integer  :player_a_ships, default: 20
      t.integer  :player_b_ships, default: 20
      t.string   :play_status
      t.text     :player_a_board
      t.text     :player_b_board
      t.text     :game_log, default: "Game has started."
      t.text     :ai_moves_pull
      t.text     :ai_neglected_moves

      t.timestamps
    end
  end
end

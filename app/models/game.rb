class Game < ApplicationRecord

  def self.start_game(player_a, player_b, board_id)
    g = Game.new(player_a: player_a, player_b: player_b)

    g.title = "#{player_a.name} vs. #{player_b.name}"

    if board_id.nil? || !Board.find_by(id: board_id).is_ready?
      g.player_a_board = new_random_board
    else
      g.player_a_board = Board.find_by(id: board_id).grid
    end

    g.player_b_board = new_random_board
    g.move_again = false
    g.ai_neglected_moves = []
    g.ai_moves_pull = []

    g.save

    Board.where("player_id = ? AND saved = ?", player_a.id, false).delete_all

    return g
  end

  def self.new_random_board
    board = Board.new

    while !board.is_ready?
      board.direction = rand(2) == 1 ? true : false
      board.place_ship(rand(10), rand(10))
    end

    return board.grid
  end

  def game_over?
    return true if player_a_ships == 0
    return true if player_b_ships == 0

    return false
  end
end

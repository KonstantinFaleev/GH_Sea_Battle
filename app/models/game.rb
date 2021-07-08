class Game

  #to differ cases when ship is hit and player should move again
  attr_accessor :move_again

  def player_a
    Player.with_deleted.find(player_a_id)
  end

  # Returns a new Game object with the associated players A and Bot
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

  #each cell of the board is array of two elements.
  #the first element shows cell content
  #the second one is 0 if cell is empty, or contains a link to a ship object
  #cell content:
  #0 - not checked cell, empty
  #1 - not checked cell, contains deck of a ship
  #3 - damaged or sunk ship
  #4 - checked empty cell
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

  # The do move method is intended to process player moves
  def do_move(player, x, y)
    flag = self.player_a == player

    board = flag ? self.player_b_board : self.player_a_board
    ships = flag ? self.player_b_ships : self.player_a_ships
    other_player = flag ? self.player_b : self.player_a

    if board[x][y][0] == 1
      board[x][y][0] = 3
      ship = board[x][y][1].reload
      ship.update_attribute('decks', ship.decks-1)
      ships -= 1
      self.move_again = true
      self.game_log = "#{player.name} shoots #{('A'..'J').to_a[y]}#{x} and " \
                      "damages #{other_player.name}'s ship!\n" + self.game_log
      if ship.reload.is_sunk?
        player.increment!(:ships_destroyed, by = 1)
        other_player.increment!(:ships_lost, by = 1)
        self.game_log = "#{other_player.name}'s ship is now destroyed!\n" + self.game_log
      end

      #AI next move coordinates determination
      if !flag
        set_ai_next_move x, y
      end

    elsif board[x][y][0] == 0
      board[x][y][0] = 4
      self.move_again = false
      self.game_log = "#{player.name} shoots #{('A'..'J').to_a[y]}#{x} and misses.\n" + self.game_log
    end

    if flag
      self.player_b_board = board
      self.player_b_ships = ships
    else
      self.player_a_board = board
      self.player_a_ships = ships
      self.ai_neglected_moves << [x,y]
    end

    set_play_status player, false
  end

  # Method that sets the play_status member
  def set_play_status(player, surrender)
    if game_over?
      # forced to use update_attributes explicitly?
      #self.winner = player
      self.update_attributes :winner => player
      if self.winner == self.player_a
        self.update_attributes :looser => player_b
        self.play_status = "You have won this game. Congratulations!"
      else
        self.update_attributes :looser => player_a
        if surrender
          self.play_status = "You have surrendered."
        else
          self.play_status = "You've lost to #{self.player_b.name}. Better luck next time!"
        end
      end

      self.game_log = "#{player.name} receives 100 pts.\n#{looser.name} loses 50 pts.\n" + self.game_log

      if surrender
        self.game_log = "Game is over. #{self.looser.name} has surrendered.\n" + self.game_log
      else
        self.game_log = "Game is over. #{player.name} celebrates the victory.\n" + self.game_log
      end

      self.looser.update_attribute('rating', self.looser.rating - 50)
      player.update_attribute('rating', player.rating + 100)

      self.ai_moves_pull = self.ai_neglected_moves = nil
    end
    self.save
  end

  def surrender_game
    self.player_a_ships = 0
    set_play_status player_b, true
  end



end
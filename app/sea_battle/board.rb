class Board
  attr_reader :player_one, :player_two

  def add_board
    if self.new_record?
      self.available_ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
      grid = []
      10.times do
        row = []
        10.times do
          row << [0, 0]
        end
        grid << row
      end
      self.grid = grid
    end
  end

  def new
    @player_two = Array.new(10).map! { Array.new(10) }
    @player_one = Array.new(10).map! { Array.new(10) }
  end
end
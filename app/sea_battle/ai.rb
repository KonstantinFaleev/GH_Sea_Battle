class Ai
  attr_reader :my_ships, :my_shots

  def initialize(battlefield)
    @battlefield = battlefield
    @my_ships = generate_my_ships
    @my_shots
  end

  def get_move_for_ai

    if self.ai_moves_pull.empty?
      x = rand(10)
      y = rand(10)

      while self.ai_neglected_moves.include?([x,y])
        x = rand(10)
        y = rand(10)
      end

      return x,y
    else
      ind = rand(self.ai_moves_pull.size)
      x,y = self.ai_moves_pull[ind]
      self.ai_moves_pull.delete_at(ind)

      return x,y
    end
  end

  def set_ai_next_move(x,y)

    if self.player_a_board[x][y][1].reload.is_sunk?
      for i in x-1..x+1
        for j in y-1..y+1
          self.ai_neglected_moves << [i, j]
        end
      end
      self.ai_moves_pull = []
    else
      self.ai_neglected_moves << [x+1, y+1]
      self.ai_neglected_moves << [x-1, y-1]
      self.ai_neglected_moves << [x+1, y-1]
      self.ai_neglected_moves << [x-1, y+1]
      if  self.ai_moves_pull.empty?
        self.ai_moves_pull << [x-1, y] unless x-1 < 0 || self.ai_neglected_moves.include?([x-1, y])
        self.ai_moves_pull << [x+1, y] unless x+1 > 9 || self.ai_neglected_moves.include?([x+1, y])
        self.ai_moves_pull << [x, y-1] unless y-1 < 0 || self.ai_neglected_moves.include?([x, y-1])
        self.ai_moves_pull << [x, y+1] unless y+1 > 9 || self.ai_neglected_moves.include?([x, y+1])
      else
        x1 = y1 = x2 = y2 = 0
        self.ai_moves_pull.each do |e|
          if e[0] == x
            x1,y1 = e
            if e[1] < y
              x2,y2 = x,y+1 unless y+1 > 9
            else
              x2,y2 = x,y-1 unless y-1 < 0
            end
          elsif e[1] == y
            x1,y1 = e
            if e[0] < x
              x2,y2 = x+1,y unless x+1 > 9
            else
              x2,y2 = x-1,y unless x-1 < 0
            end
          end
        end
        self.ai_moves_pull.each do |e|
          if e != [x1,y1]
            self.ai_neglected_moves << e
          end
        end
        self.ai_moves_pull = []
        self.ai_moves_pull << [x1,y1] unless [x1,y1] == [0,0]
        self.ai_moves_pull << [x2,y2] unless [x2,y2] == [0,0]
      end
    end
  end
  def attack (shild, coords)
    []

  end



  private

  def generate_my_ships

  end
end

class Ship2Controller < ApplicationController
  def create
  end

  def show
    @player_one = Array.new(10).map!{Array.new(10)}

    @player_one.each_index do |i|
      @player_one[i].each_index do |j|
        @player_one[i][j] = [i,'_',j]
      end
    end


    if rand(0..1) == 1

    horizontal_axis = rand(0..6)
    vertical_axis = rand(0..9)
    z = x + 4
      while horizontal_axis < z
        @player_one[horizontal_axis+1][vertical_axis] = 'Z'
        horizontal_axis = horizontal_axis + 1
      end
    else
      x = rand(0..9)
      y = rand(0..6)
      z = y + 4
      while y < z
        @player_one[x][y+1] = 'Z'
        y = y + 1
      end
    end

    render 'show'
  end

  def set_ship
    @position == rand(0..1)
    @ship_count = 1
    while @ship_count < 11 do
      case @ship_count
        when 0..1 # ставим четырехпалубный
          if rand(0..1) == 1 # расположение корабля вертикально (1) или горизонтально (0)
            # генерируем координаты и если валидны записываем в массив
            x = rand(0..6)
            y = rand(0..9)
            @player_one[x][y] = 'Z'
          else

          end


        when 2..3 # ставим два трехпалубных
          действие2
        when 4..6 # ставим три двухпалубных
          действие3
        else # ставим 4 однопалубных
          действие
      end
    end
  end
end

class GameController < ApplicationController

  def index

      puts 'session_no'
      @player_one = Sea.new(field_size: 30)
      @player_two = Sea.new(field_size: 40)

  end

  def create
    @player_two = Array.new(10).map! { Array.new(10) }
    @player_one = Array.new(10).map! { Array.new(10) }
    @player_one.each_index do |x_axis|
      @player_one[x_axis].each_index do |y_axis|
        @player_one[x_axis][y_axis] = ''
      end
    end
    @player_one = Sea.new(blank: false).player_field
    puts 'do session'
    session[:player_one] = @player_one
    session[:player_two] = @player_two
    puts 'oposle'

    render 'index'
  end



end

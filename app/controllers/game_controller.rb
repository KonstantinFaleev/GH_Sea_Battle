class GameController < ApplicationController
  def index


    if session[:player_one]
      puts 'session yes'
      puts session[:player_one]
      @player_one = session[:player_one]
      @player_two = session[:player_two]

      puts 'session yes2'
      puts @player_one
    else
      puts 'session_no'
      @player_one = Sea.new.field_empty
      @player_two = Sea.new.field_empty
    end


  end

  def create
    @player_two = Array.new(10).map! { Array.new(10) }
    @player_one = Array.new(10).map! { Array.new(10) }
    @player_one.each_index do |x_axis|
      @player_one[x_axis].each_index do |y_axis|
        @player_one[x_axis][y_axis] = ''
      end
    end
    @player_one = Sea.new.set_ship
    puts 'do session'
    session[:player_one] = @player_one
    session[:player_two] = @player_two
    puts 'oposle'

    render 'index'
  end



end

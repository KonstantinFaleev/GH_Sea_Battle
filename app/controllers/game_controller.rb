class GameController < ApplicationController

  def index
    if session[:player_one]
      @player_one = session[:player_one]
      @player_two = session[:player_two]
    else
      @player_one = field_empty(10)
      @player_two = field_empty(10)
    end
  end

  def create
    @player_one = field_empty(10)
    @player_two = field_empty(10)
    set_ships
    session[:player_one] = @player_one
    session[:player_two] = @player_two
    render 'index'
  end

  private

  def field_empty(field_size)
    Array.new(field_size).map! { Array.new(field_size).map! { Cell.new } }
  end

  def set_ships
    #all_ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
    

  end


end

class GameController < ApplicationController

  def index
    if session[:player_one]
      @player_one = session[:player_one]
      @player_two = session[:player_two]
    else
      puts 'session_no'
      @player_one = Sea.new(field_size: 10)
      @player_two = Sea.new(field_size: 10)
    end
  end

  def create
    @player_one = Sea.new(blank: false, field_size: 10)
    @player_two = Sea.new(blank: true, field_size: 10)
    session[:player_one] = @player_one
    session[:player_two] = @player_two
    render 'index'
  end
end

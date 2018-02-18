require 'test_helper'

class GameControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get game_show_url
    assert_response :success
  end

  test "should get create" do
    get game_create_url
    assert_response :success
  end

  test "should get move" do
    get game_move_url
    assert_response :success
  end

  test "should get win" do
    get game_win_url
    assert_response :success
  end

end

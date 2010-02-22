class BoardController < ApplicationController
  def show
    # do nothing
  end
  def image_paths
    respond_to { |format| format.json { render(:json => (all_tile_paths)) } }
  end
end
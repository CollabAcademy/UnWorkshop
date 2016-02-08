class CreateRounds < ActiveRecord::Migration
  def change
    create_table :rounds do |t|
      t.integer :number
      t.text :question
      t.integer :event_id
      t.datetime :expires_at

      t.timestamps null: false
    end
  end
end

task :test do
  Dir['test/unit/**/*.js'].each do |file|
    puts "> #{file}"
    sh "cd #{File.dirname(file)}; js #{File.basename(file)}"
  end
end
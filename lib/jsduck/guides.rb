require 'jsduck/logger'
require 'jsduck/json_duck'
require 'fileutils'

module JsDuck

  # Reads in guides and converts them to JsonP files
  class Guides
    def initialize(formatter)
      @formatter = formatter
      @guides = []
    end

    # Parses guides config file
    def parse(filename)
      @path = File.dirname(filename)
      @guides = JsonDuck.read(filename)
    end

    # Writes all guides to given dir in JsonP format
    def write(dir)
      return if @guides.length == 0

      FileUtils.mkdir(dir) unless File.exists?(dir)
      @guides.each {|group| group["items"].each {|g| write_guide(g, dir) } }
      # Write the JSON to output dir, so it's available in released
      # version of docs and people can use it with JSDuck by themselves.
      JsonDuck.write_json(dir+"/guides.json", @guides)
    end

    def write_guide(guide, dir)
      guide_dir = @path + "/guides/" + guide["name"]
      tutorial_dir = @path + "/tutorials/" + guide["name"]
      out_dir = dir + "/" + guide["name"]

      if File.exists?(guide_dir)
        in_dir = guide_dir
      elsif File.exists?(tutorial_dir)
        in_dir = tutorial_dir
      else
        return Logger.instance.warn("Guide #{guide_dir} / #{tutorial_dir} not found")
      end

      guide["title"].each_pair do |lang, title|
        guide_file = in_dir + "/README." + lang + ".md"
        return Logger.instance.warn("README.#{lang}.md not found in #{in_dir}") unless File.exists?(guide_file)

        Logger.instance.log("Writing #{lang} guide #{out_dir} ...")
        # Copy the whole guide dir over
        FileUtils.cp_r(in_dir, out_dir)
  
        @formatter.doc_context = {:filename => guide_file, :linenr => 0}

        # Replace the ＃with #. This is a workaround for Google translate
        # changing the # character.
        input = IO.read(guide_file);
        input.gsub!(/\357\274\203/, "#")

        html = @formatter.format(input)
        name = File.basename(in_dir)
        html.gsub!(/<img src="/, "<img src=\"guides/#{name}/")
  
        JsonDuck.write_jsonp(out_dir+"/README.#{lang}.js", name, {:guide => html, :title => title})
      end
    end

    # Returns all guides as array
    def to_array
      @guides
    end

    # Returns HTML listing of guides
    def to_html
      return "" if @guides.length == 0

      html = @guides.map do |group|
        [
          "<h3>#{group['title']}</h3>",
          "<ul>",
          group["items"].map {|g| "<li><a href='#!/guide/#{g['name']}'>#{g['title']}</a></li>" },
          "</ul>",
        ]
      end.flatten.join("\n")

      return <<-EOHTML
        <div id='guides-content' style='display:none'>
            #{html}
        </div>
      EOHTML
    end
  end

end

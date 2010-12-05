require 'strscan'

module JsDuck

  class Lexer
    def initialize(input)
      @input = StringScanner.new(input)
      tokenize
    end

    def look(*tokens)
      i = 0
      tokens.all? do |t|
        tok = @tokens[i]
        i += 1
        return false if tok == nil
        if t.instance_of?(Symbol) then
          tok[:type] == t
        else
          tok[:value] == t
        end
      end
    end

    def next(full=false)
      tok = @tokens.shift
      full ? tok : tok[:value]
    end

    def empty?
      @tokens.empty?
    end

    # Goes through the whole input and tokenizes it
    def tokenize
      @tokens = []
      while !@input.eos? do
        skip_white_and_comments
        if @input.check(/[0-9]+/) then
          @tokens << {
            :type => :number,
            :value => eval(@input.scan(/[0-9]+(\.[0-9]*)?/))
          }
        elsif @input.check(/\w+/) then
          value = @input.scan(/\w+/)
          @tokens << {
            :type => KEYWORDS[value] ? :keyword : :ident,
            :value => value
          }
        elsif @input.check(/\/\*\*/) then
          @tokens << {
            :type => :doc_comment,
            :value => @input.scan_until(/\*\/|\Z/)
          }
        elsif @input.check(/"/) then
          @tokens << {
            :type => :string,
            :value => eval(@input.scan(/"([^"\\]|\\.)*"/))
          }
        elsif @input.check(/'/) then
          @tokens << {
            :type => :string,
            :value => eval(@input.scan(/'([^'\\]|\\.)*'/))
          }
        elsif @input.check(/\//) then
          if regex? then
            @tokens << {
              :type => :regex,
              :value => @input.scan(/\/([^\/\\]|\\.)*\/[gim]*/)
            }
          else
            @tokens << {
              :type => :operator,
              :value => @input.scan(/\//)
            }
          end
        elsif @input.check(/./) then
          @tokens << {
            :type => :operator,
            :value => @input.scan(/./)
          }
        end
      end
    end

    # A slash "/" is a division operator if it follows:
    # - identifier
    # - the "this" keyword
    # - number
    # - closing bracket )
    # - closing square-bracket ]
    # Otherwise it's a beginning of regex
    def regex?
      if @tokens.last then
        type = @tokens.last[:type]
        value = @tokens.last[:value]
        if type == :ident || type == :number
          return false
        elsif type == :keyword && value == "this"
          return false
        elsif type == :operator && (value == ")" || value == "]")
          return false
        end
      end
      return true
    end

    def skip_white_and_comments
      skip_white
      while multiline_comment? || line_comment? do
        if multiline_comment? then
          @input.scan_until(/\*\/|\Z/)
        elsif line_comment? then
          @input.scan_until(/\n|\Z/)
        end
        skip_white
      end
    end

    def multiline_comment?
      @input.check(/\/\*[^*]/)
    end

    def line_comment?
      @input.check(/\/\//)
    end

    def skip_white
      @input.scan(/\s+/)
    end

    KEYWORDS = {
      "break" => true,
      "case" => true,
      "catch" => true,
      "continue" => true,
      "default" => true,
      "delete" => true,
      "do" => true,
      "else" => true,
      "finally" => true,
      "for" => true,
      "function" => true,
      "if" => true,
      "in" => true,
      "instanceof" => true,
      "new" => true,
      "return" => true,
      "switch" => true,
      "this" => true,
      "throw" => true,
      "try" => true,
      "typeof" => true,
      "var" => true,
      "void" => true,
      "while" => true,
      "with" => true,
    }
  end

end
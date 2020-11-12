# Vim Mappings For ORCΛ

​                         <img src="https://raw.githubusercontent.com/hundredrabbits/100r.co/master/media/content/characters/orca.hello.png" width="300"/><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Icon-Vim.svg/1200px-Icon-Vim.svg.png" width=200/>

Fork of the lovely [ORCΛ](https://github.com/hundredrabbits/orca) from Hundred Rabbits with rudimentary Vim navigation and editing mappings. 

## Supported Mappings

| Key(s)                        | Behavior                                                     |
| ----------------------------- | ------------------------------------------------------------ |
| <kbd>h</kbd>                  | Move cursor west \[count times]                              |
| <kbd>j</kbd>                  | Move cursor south \[count times\]                            |
| <kbd>k</kbd>                  | Move cursor north \[count times]                             |
| <kbd>l</kbd>                  | Move cursor east \[count times]                              |
| <kbd>w</kbd>                  | Move cursor forward by word \[count times]                   |
| <kbd>b</kbd>                  | Move cursor backward by word \[count times]                  |
| <kbd>i</kbd>                  | Enter Insert mode                                            |
| <kbd>v</kbd>                  | Enter Visual mode                                            |
| <kbd>/</kbd>                  | Enter Find mode (via native Commander)                       |
| <kbd>n</kbd>                  | Jump to next find match                                      |
| <kbd>N</kbd>                  | Jump to previous find match                                  |
| <kbd>m</kbd>{*a-zA-Z*}         | Set mark                                                     |
| <kbd>'</kbd>{*a-zA-Z*}        | Jump to mark                                                 |
| <kbd>Esc</kbd>                | Return to Normal mode                                        |
| <kbd>u</kbd>                  | Undo last change                                             |
| [<kbd>'</kbd>*x*]<kbd>x</kbd> | Delete character under cursor (into optional register)       |
| [<kbd>'</kbd>*x*]<kbd>d</kbd>{*motion*}  | Delete the text that motion moves over (into optional register) |
| [<kbd>'</kbd>*x*]<kbd>y</kbd>{*motion*}  | Yank the text that motion moves over (into optional register) |
| [<kbd>'</kbd>*x*]<kbd>p</kbd>            | Put text (from optional register) at cursor position         |

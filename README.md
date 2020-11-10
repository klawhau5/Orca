# Vim Mappings For ORCΛ

​                         <img src="https://raw.githubusercontent.com/hundredrabbits/100r.co/master/media/content/characters/orca.hello.png" width="300"/><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Icon-Vim.svg/1200px-Icon-Vim.svg.png" width=200/>

Fork of the lovely [ORCΛ](https:github.com/hundredrabbits/orca) From Hundred Rabbits with rudimentary Vim navigation and editing mappings. 

## Supported Mappings

| Command             | Behavior                                                     |
| ------------------- | ------------------------------------------------------------ |
| **h**               | Move cursor west \[count times]                              |
| **j**               | Move cursor south \[count times\]                            |
| **k**               | Move cursor north \[count times]                             |
| **l**               | Move cursor east \[count times]                              |
| **w**               | Move cursor forward by word \[count times]                   |
| **b**               | Move cursor backward by word \[count times]                  |
| **i**               | Enter Insert mode                                            |
| **v**               | Enter Visual mode                                            |
| **Escape**          | Return to Normal mode                                        |
| **u**               | Undo last change                                             |
| \["x]**x**          | Deletes character under cursor (into optional register)      |
| ["x\]**d**{motion}  | Delete the text that motion moves over (into optional register) |
| \["x\]**y**{motion} | Yank the text that motion moves over (into optional register) |
| \["x]**p**          | Put text (from optional register) at cursor position         |
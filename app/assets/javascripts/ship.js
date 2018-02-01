
$(document).on('turbolinks:load', function() {

    window.onload = function() {
        /* variables
        shipSide	- размер палубы
        user.field 	- игровое поле пользователя
        comp.field 	- игровое поле компьютера
        user.fieldX,
        user.fieldY	- координаты игрового поля пользователя
        comp.fieldX,
        comp.fieldY	- координаты игрового поля компьютера

        0 - пустое место
        1 - палуба корабля
        2 - клетка рядом с кораблём
        3 - обстрелянная клетка
        4 - попадание в палубу
        */

        'use strict';

        function Field(field) {
            this.fieldSide	= 330,
                this.shipSide	= 33,
                this.shipsData	= [
                    '',
                    [4, 'fourdeck'],
                    [3, 'tripledeck'],
                    [2, 'doubledeck'],
                    [1, 'singledeck']
                ],

                this.field		= field;
            this.fieldX		= field.getBoundingClientRect().top + pageYOffset;
            this.fieldY		= field.getBoundingClientRect().left + pageXOffset;
            this.fieldRight	= this.fieldY + this.fieldSide;
            this.fieldBtm	= this.fieldX + this.fieldSide;
            this.squadron	= [];
        }

        Field.prototype.randomLocationShips = function() {
            this.matrix = createMatrix();

            for (var i = 1, length = this.shipsData.length; i < length; i++) {
                // i == кол-во кораблей
                var decks = this.shipsData[i][0]; // кол-во палуб
                for (var j = 0; j < i; j++) {
                    // получаем координаты первой палубы и направление расположения палуб (корабля)
                    var fc = this.getCoordinatesDecks(decks);

                    fc.decks 	= decks,
                        fc.shipname	= this.shipsData[i][1] + String(j + 1);

                    // создаём экземпляр корабля и выводим на экран
                    var ship = new Ships(this, fc);
                    ship.createShip();
                }
            }
        }

        Field.prototype.getCoordinatesDecks = function(decks) {
            // kx == 1 - вертикально, ky == 1 - горизонтально
            var kx = getRandom(1),
                ky = (kx == 0) ? 1 : 0,
                x, y;

            if (kx == 0) {
                x = getRandom(9);
                y = getRandom(10 - decks);
            } else {
                x = getRandom(10 - decks);
                y = getRandom(9);
            }

            // валидация палуб корабля
            var result = this.checkLocationShip(x, y, kx, ky, decks);
            if (!result) return this.getCoordinatesDecks(decks);

            var obj = {
                x: x,
                y: y,
                kx: kx,
                ky: ky
            };
            return obj;
        }

        Field.prototype.checkLocationShip = function(x, y, kx, ky, decks) {
            var fromX, toX, fromY, toY;

            fromX = (x == 0) ? x : x - 1;
            if (x + kx * decks == 10 && kx == 1) toX = x + kx * decks;
            else if (x + kx * decks < 10 && kx == 1) toX = x + kx * decks + 1;
            else if (x == 9 && kx == 0) toX = x + 1;
            else if (x < 9 && kx == 0) toX = x + 2;

            fromY = (y == 0) ? y : y - 1;
            if (y + ky * decks == 10 && ky == 1) toY = y + ky * decks;
            else if (y + ky * decks < 10 && ky == 1) toY = y + ky * decks + 1;
            else if (y == 9 && ky == 0) toY = y + 1;
            else if (y < 9 && ky == 0) toY = y + 2;

            // если корабль при повороте выходит за границы игрового поля
            // т.к. поворот происходит относительно первой палубы, то
            // fromX и from, всегда валидны
            if (toX === undefined || toY === undefined) return false;

            for (var i = fromX; i < toX; i++) {
                for (var j = fromY; j < toY; j++) {
                    if (this.matrix[i][j] == 1) return false;
                }
            }
            return true;
        }

        Field.prototype.cleanField = function() {
            var parent	= this.field,
                id		= parent.getAttribute('id'),
                divs 	= document.querySelectorAll('#' + id + ' > div');

            [].forEach.call(divs, function(el) {
                parent.removeChild(el);
            });
            // очищаем массив объектов кораблей
            this.squadron.length = 0;
        }

        //создаём экземпляры объектов игровых полей
        var userfield = getElement('field_user'),
            compfield = getElement('field_comp'),
            comp;

        var user = new Field(getElement('field_user'));

        /////////////////////////////////////////

        function Ships(player, fc) {
            this.player 	= player;
            this.shipname 	= fc.shipname;
            this.decks		= fc.decks;
            this.x0			= fc.x; // координата X первой палубы
            this.y0			= fc.y; // координата Y первой палубы
            this.kx			= fc.kx;
            this.ky 		= fc.ky;
            this.hits 		= 0; // попадания
            this.sunk		= false; // корабль потоплен
            this.matrix		= []; // координаты палуб
        }

        Ships.prototype.createShip = function() {
            var k		= 0,
                x		= this.x0,
                y		= this.y0,
                kx		= this.kx,
                ky		= this.ky,
                decks	= this.decks,
                player	= this.player

            while (k < decks) {
                // записываем координаты корабля в матрицу игрового поля
                player.matrix[x + k * kx][y + k * ky] = 1;
                // записываем координаты корабля в матрицу экземпляра корабля
                this.matrix.push([x + k * kx, y + k * ky]);
                k++;
            }

            player.squadron.push(this);
            console.log (player.squadron);
            // send array to server

            $.post('ship',{
                    send1:player.squadron
                },
                function(data) {
                    $(".result").html(data);
                });
            //end send array to server



            if (player == user) this.showShip();
            //this.showShip();
            if (user.squadron.length == 10) {
                getElement('play').setAttribute('data-hidden', 'false');
            }
        }

        Ships.prototype.showShip = function() {
            var div			= document.createElement('div'),
                dir			= (this.kx == 1) ? ' vertical' : '',
                classname	= this.shipname.slice(0, -1),
                player		= this.player;

            div.setAttribute('id', this.shipname);
            div.className = 'ship ' + classname + dir;
            div.style.cssText = 'left:' + (this.y0 * player.shipSide) + 'px; top:' + (this.x0 * player.shipSide) + 'px;';
            player.field.appendChild(div);
        }

        /////////////////////////////////////////

        function Instance() {
            this.pressed = false;
        }

        Instance.prototype.setObserver = function() {
            var fieldUser		= getElement('field_user'),
                initialShips	= getElement('ships_collection');

            fieldUser.addEventListener('mousedown', this.onMouseDown.bind(this));
            fieldUser.addEventListener('contextmenu', this.rotationShip.bind(this));
            initialShips.addEventListener('mousedown', this.onMouseDown.bind(this));
            document.addEventListener('mousemove', this.onMouseMove.bind(this));
            document.addEventListener('mouseup', this.onMouseUp.bind(this));
        }

        Instance.prototype.onMouseDown = function(e) {
            if (e.which != 1) return false;

            var el = e.target.closest('.ship');
            if (!el) return;
            this.pressed = true;

            // запоминаем переносимый объект и его свойства
            this.draggable = {
                elem:	el,
                //запоминаем координаты, с которых начат перенос
                downX:	e.pageX,
                downY:	e.pageY,
                kx:		0,
                ky:		1
            };

            // нажатие мыши произошло по установленному кораблю, находящемуся
            // в игровом поле юзера (редактирование положения корабля)
            if (el.parentElement.getAttribute('id') == 'field_user') {
                var name = el.getAttribute('id');
                this.getDirectionShip(name);

                var computedStyle	= getComputedStyle(el);
                this.draggable.left	= computedStyle.left.slice(0, -2);
                this.draggable.top	= computedStyle.top.slice(0, -2);

                this.cleanShip(el);
            }
            return false;
        }

        Instance.prototype.onMouseMove = function(e) {
            if (this.pressed == false || !this.draggable.elem) return;

            // посчитать дистанцию, на которую переместился курсор мыши
            /*var moveX = e.pageX - this.draggable.downX,
                moveY = e.pageY - this.draggable.downY;
            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) return;*/

            if (!this.clone) {
                this.clone = this.creatClone(e);
                // еслине удалось создать clone
                if (!this.clone) return;

                var coords = getCoords(this.clone);
                this.shiftX = this.draggable.downX - coords.left;
                this.shiftY = this.draggable.downY - coords.top;

                this.startDrag(e);
                this.decks = this.getDecksClone();
            }

            // координаты сторон аватара
            var currLeft	= e.pageX - this.shiftX,
                currTop		= e.pageY - this.shiftY,
                currBtm		= (this.draggable.kx == 0) ? currTop + user.shipSide : currTop + user.shipSide * this.decks,
                currRight	= (this.draggable.ky == 0) ? currLeft + user.shipSide : currLeft + user.shipSide * this.decks;

            this.clone.style.left = currLeft + 'px';
            this.clone.style.top = currTop + 'px';

            if (currLeft >= user.fieldY - 14 && currRight <= user.fieldRight + 14 && currTop >= user.fieldX - 14 && currBtm <= user.fieldBtm + 14) {
                // получаем координаты привязанные в сетке поля и в координатах матрицы
                var	coords = this.getCoordsClone(this.decks);
                // проверяем валидность установленных координат
                var result = user.checkLocationShip(coords.x, coords.y, this.draggable.kx, this.draggable.ky, this.decks);

                if (result) {
                    this.clone.classList.remove('unsuccess');
                    this.clone.classList.add('success');
                } else {
                    this.clone.classList.remove('success');
                    this.clone.classList.add('unsuccess');
                }
            } else {
                this.clone.classList.remove('success');
                this.clone.classList.add('unsuccess');
            }
            return false;
        }

        Instance.prototype.onMouseUp = function(e) {
            this.pressed = false;
            if (this.clone) {
                var dropElem = this.findDroppable(e);

                // если корабль пытаются поставить в запретные координаты, то возвращаем
                // его в первоначальное место: или '#user_field' или '#initial_ships'
                if (this.clone.classList.contains('unsuccess')) {
                    document.querySelector('.unsuccess').classList.remove('unsuccess');
                    this.clone.rollback();

                    if (this.draggable.left !== undefined && this.draggable.top !== undefined) {
                        this.draggable.elem.style.cssText = 'left:' + this.draggable.left + 'px; top:' + this.draggable.top + 'px;';
                    } else {
                        this.cleanClone();
                        return;
                    }
                }

                if (dropElem && dropElem == user.field || this.draggable.left !== undefined && this.draggable.top !== undefined) {
                    // получаем координаты привязанные в сетке поля и в координатах матрицы
                    var	coords = this.getCoordsClone(this.decks);

                    user.field.appendChild(this.clone);
                    // this.x0 = coords.x;
                    // this.y0 = coords.y;
                    this.clone.style.left = coords.left + 'px';
                    this.clone.style.top = coords.top + 'px';

                    // создаём экземпляр корабля
                    var	fc = {
                            'shipname': this.clone.getAttribute('id'),
                            'x': coords.x,
                            'y': coords.y,
                            'kx': this.draggable.kx,
                            'ky': this.draggable.ky,
                            'decks': this.decks
                        },
                        ship = new Ships(user, fc);
                    ship.createShip();
                    getElement(ship.shipname).style.zIndex = null;
                    getElement('field_user').removeChild(this.clone);
                } else {
                    this.clone.rollback();
                    if (this.draggable.left !== undefined && this.draggable.top !== undefined) {
                        this.draggable.elem.style.cssText = 'left:' + this.draggable.left + 'px; top:' + this.draggable.top + 'px;';
                    }
                }
                this.cleanClone();
            }
            return false;
        }

        Instance.prototype.creatClone = function(e) {
            var avatar	= this.draggable.elem,
                old		= {
                    parent:			avatar.parentNode,
                    nextSibling:	avatar.nextSibling,
                    left:			avatar.left || '',
                    top:			avatar.top || '',
                    zIndex:			avatar.zIndex || ''
                };

            avatar.rollback = function() {
                old.parent.insertBefore(avatar, old.nextSibling);
                avatar.style.left = old.left;
                avatar.style.top = old.top;
                avatar.style.zIndex = old.zIndex;
            };
            return avatar;
        }

        Instance.prototype.startDrag = function(e) {
            document.body.appendChild(this.clone);
            this.clone.style.zIndex = 1000;
        }

        Instance.prototype.findDroppable = function(e) {
            this.clone.hidden = true;
            var el = document.elementFromPoint(e.clientX, e.clientY);
            this.clone.hidden = false;
            return el.closest('.ships');
        }

        Instance.prototype.getDecksClone = function() {
            var type = this.clone.getAttribute('id').slice(0, -1);
            for (var i = 1, length = user.shipsData.length; i < length; i++) {
                if (user.shipsData[i][1] === type) {
                    return user.shipsData[i][0];
                }
            }
        }

        Instance.prototype.getCoordsClone = function(decks) {
            var pos		= this.clone.getBoundingClientRect(),
                left	= pos.left - user.fieldY,
                right	= pos.right - user.fieldY,
                top		= pos.top - user.fieldX,
                bottom	= pos.bottom - user.fieldX,
                coords	= {};

            coords.left = (left < 0) ? 0 : (right > user.fieldSide) ? user.fieldSide - user.shipSide * decks : left;
            coords.left = Math.round(coords.left / user.shipSide) * user.shipSide;
            coords.top	= (top < 0) ? 0 : (bottom > user.fieldSide) ? user.fieldSide - user.shipSide : top;
            coords.top	= Math.round(coords.top / user.shipSide) * user.shipSide;
            coords.x	= coords.top / user.shipSide;
            coords.y	= coords.left / user.shipSide;

            return coords;
        }

        Instance.prototype.cleanClone = function() {
            delete this.clone;
            delete this.draggable;
        }

        Instance.prototype.rotationShip = function(e) {
            if (e.which != 3) return false;
            e.preventDefault();
            e.stopPropagation();

            var id = e.target.getAttribute('id');

            // ищем корабль, у которого имя совпадает с полученным id
            for (var i = 0, length = user.squadron.length; i < length; i++) {
                var data = user.squadron[i];
                if (data.shipname == id && data.decks != 1) {
                    var kx	= (data.kx == 0) ? 1 : 0,
                        ky	= (data.ky == 0) ? 1 : 0;

                    // удаляем экземпляр корабля
                    this.cleanShip(e.target);
                    user.field.removeChild(e.target);

                    // проверяем валидность координат
                    var result = user.checkLocationShip(data.x0, data.y0, kx, ky, data.decks);
                    if (result === false) {
                        var kx	= (kx == 0) ? 1 : 0,
                            ky	= (ky == 0) ? 1 : 0;
                    }
                    // создаём экземпляр корабля
                    var	fc = {
                            'shipname': data.shipname,
                            'x': data.x0,
                            'y': data.y0,
                            'kx': kx,
                            'ky': ky,
                            'decks': data.decks
                        },
                        ship = new Ships(user, fc);

                    ship.createShip();
                    if (result === false) {
                        var el = getElement(ship.shipname);
                        el.classList.add('unsuccess');
                        setTimeout(function() {
                            el.classList.remove('unsuccess');
                        }, 500);
                    }
                    return false;
                }
            }
            return false;
        }

        Instance.prototype.cleanShip = function(el) {
            // получаем координаты в матрице
            var coords = el.getBoundingClientRect(),
                x = Math.round((coords.top - user.fieldX) / user.shipSide),
                y = Math.round((coords.left - user.fieldY) / user.shipSide),
                data, k;

            // ищем корабль, которому принадлежат данные координаты
            for (var i = 0, length = user.squadron.length; i < length; i++) {
                data = user.squadron[i];
                if (data.x0 == x && data.y0 == y) {
                    // удаляем из матрицы координаты корабля
                    k = 0;
                    while(k < data.decks) {
                        user.matrix[x + k * data.kx][y + k * data.ky] = 0;
                        k++;
                    }
                    // удаляем корабль из массива
                    user.squadron.splice(i, 1);
                    return;
                }
            }
        }

        Instance.prototype.getDirectionShip = function(shipname) {
            var data;
            for (var i = 0, length = user.squadron.length; i < length; i++) {
                data = user.squadron[i];
                if (data.shipname === shipname) {
                    this.draggable.kx = data.kx;
                    this.draggable.ky = data.ky;
                    return;
                }
            }
        }

        /////////////////////////////////////////

        getElement('type_placement').addEventListener('click', function(e) {
            var el = e.target;
            if (el.tagName != 'SPAN') return;

            var shipsCollection = getElement('ships_collection');
            getElement('play').setAttribute('data-hidden', true);
            // очищаем матрицу
            user.cleanField();

            var type = el.getAttribute('data-target'),
                typeGeneration = {
                    'random': function() {
                        shipsCollection.setAttribute('data-hidden', true);
                        user.randomLocationShips();
                    },
                    'manually': function() {
                        user.matrix = createMatrix();
                        if (shipsCollection.getAttribute('data-hidden') === 'true') {
                            shipsCollection.setAttribute('data-hidden', false);
                            var instance = new Instance();
                            instance.setObserver();
                        } else {
                            shipsCollection.setAttribute('data-hidden', true);
                        }
                    }
                };
            typeGeneration[type]();
        });

        getElement('play').addEventListener('click', function(e) {
            getElement('instruction').setAttribute('data-hidden', true);

            // показываем поле компьютера, создаём объект поля компьютера и расставляем корабли
            document.querySelector('.field-comp').setAttribute('data-hidden', false);
            comp = new Field(compfield);
            comp.randomLocationShips();

            getElement('play').setAttribute('data-hidden', true);
            getElement('text_top').innerHTML = 'Морской бой между эскадрами';

            // удаляем события с поля игрока (отмена редактирования расстановки кораблей)
            userfield.removeEventListener('mousedown', user.onMouseDown);
            userfield.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });

            // Запуск модуля игры
            Controller.battle.init();
        });

        /////////////////////////////////////////

        var Controller = (function() {
            var player, enemy, self, coords, text,
                srvText = getElement('text_btm'),
                tm = 0;

            var battle = {
                init: function() {
                    self = this;
                    var rnd = getRandom(1);
                    player = (rnd == 0) ? user : comp;
                    enemy = (player === user) ? comp : user;

                    // массив с координатами выстрелов при рандомном выборе
                    comp.shootMatrix = [];
                    // массив с координатами выстрелов для AI
                    comp.orderedShootMatrix = [];
                    // массив с координатами вокруг клетки с попаданием
                    comp.needShootMatrix = [];

                    // объекты для хранения первого и след. выстрела
                    comp.firstHit = {};
                    comp.lastHit = {};

                    // массив значений циклов при формировании координат стрельбы
                    var loopValues = [
                        [1, 0, 10],
                        [2, 0, 10],
                        [3, 0, 10]
                        //[3, 0, 5]
                    ];
                    self.createShootMatrix(loopValues[0]);
                    for (var i = 1; i < loopValues.length; i++) {
                        self.createShootMatrix(loopValues[i]);
                    }

                    if (player === user) {
                        // устанавливаем обработчики событий для пользователя
                        compfield.addEventListener('click', self.shoot);
                        compfield.addEventListener('contextmenu', self.setEmptyCell);
                        self.showServiseText('Вы стреляете первым.');
                    } else {
                        self.showServiseText('Первым стреляет компьютер.');
                        setTimeout(function() {
                            return self.shoot();
                        }, 1000);
                    }
                },

                shoot: function(e) {
                    // e !== undefined - значит выстрел производит игрок
                    // координаты поступают по клику в px и преобразуются в координаты матрицы (coords)
                    if (e !== undefined) {
                        if (e.which != 1) return false;
                        // получаем координаты выстрела
                        coords = self.transformCoordinates(e, enemy);
                    } else {
                        // генерируются матричные координаты выстрела компьютера
                        if (comp.needShootMatrix.length) {
                            self.needShoot();
                        } else {
                            self.getCoordinatesShot();
                        }
                    }

                    var val	= enemy.matrix[coords.x][coords.y];

                    // проверяем какая иконка есть в клетке с данными координатами,
                    // если заштрихованная иконка, то удаляем её
                    self.checkFieldCell(coords);

                    switch(val) {
                        // промах
                        case 0:
                            // устанавливаем иконку промаха и записываем промах в матрицу
                            self.showIcons(enemy, coords, 'dot');
                            enemy.matrix[coords.x][coords.y] = 3;

                            text = (player === user) ? 'Вы промахнулись. Стреляет компьютер.' : 'Компьютер промахнулся. Ваш выстрел.';
                            self.showServiseText(text);

                            // определяем, чей выстрел следующий
                            player = (player === user) ? comp : user;
                            enemy = (player === user) ? comp : user;

                            if (player == comp) {
                                // снимаем обработчики событий для пользователя
                                compfield.removeEventListener('click', self.shoot);
                                compfield.removeEventListener('contextmenu', self.setEmptyCell);
                                setTimeout(function() {
                                    return self.shoot();
                                }, 1000);
                            } else {
                                // устанавливаем обработчики событий для пользователя
                                compfield.addEventListener('click', self.shoot);
                                compfield.addEventListener('contextmenu', self.setEmptyCell);
                            }
                            break;

                        // попадание
                        case 1:
                            enemy.matrix[coords.x][coords.y] = 4;
                            self.showIcons(enemy, coords, 'red-cross');

                            // вносим изменения в массив эскадры
                            // необходимо найти корабль, в который попали
                            var warship, arrayDescks;
                            for (var i = enemy.squadron.length - 1; i >= 0; i--) {
                                warship		= enemy.squadron[i]; // вся информация о карабле эскадры
                                arrayDescks	= warship.matrix; // массив с координатами палуб корабля

                                for (var j = 0, length = arrayDescks.length; j < length; j++) {
                                    // если координаты одной из палуб корабля совпали с координатами выстрела
                                    // увеличиванием счётчик попаданий
                                    if (arrayDescks[j][0] == coords.x && arrayDescks[j][1] == coords.y) {
                                        warship.hits++;
                                        // если кол-во попаданий в корабль становится равным кол-ву палуб
                                        // считаем этот корабль уничтоженным и удаляем его из эскадры
                                        if (warship.hits == warship.decks) {
                                            enemy.squadron.splice(i, 1);
                                        } else {
                                            text = (player === user) ? 'Поздравляем! Вы попали. Ваш выстрел.' : 'Компьютер попал в ваш корабль. Выстрел компьютера';
                                            self.showServiseText(text);
                                        }
                                        break;
                                    }
                                }
                            }

                            // игра закончена, все корбали эскадры противника уничтожены
                            if (enemy.squadron.length == 0) {
                                text = (player === user) ? 'Поздравляем! Вы выиграли.' : 'К сожалению, вы проиграли.';
                                text += ' Хотите продолжить игру?';
                                srvText.innerHTML = text;
                                // выводим кнопки да / нет
                                // ......

                                if (player == user) {
                                    // снимаем обработчики событий для пользователя
                                    compfield.removeEventListener('click', self.shoot);
                                    compfield.removeEventListener('contextmenu', self.setEmptyCell);
                                } else {
                                    //если выиграл комп., показываем оставшиеся корабли компьютера
                                    for (var i = 0, length = comp.squadron.length; i < length; i++) {
                                        var div			= document.createElement('div'),
                                            dir			= (comp.squadron[i].kx == 1) ? ' vertical' : '',
                                            classname	= comp.squadron[i].shipname.slice(0, -1);

                                        div.className = 'ship ' + classname + dir;
                                        div.style.cssText = 'left:' + (comp.squadron[i].y0 * comp.shipSide) + 'px; top:' + (comp.squadron[i].x0 * comp.shipSide) + 'px;';
                                        comp.field.appendChild(div);
                                    }
                                }
                                // бой продолжается
                            } else {
                                if (player === comp) {
                                    // отмечаем клетки, где точно не может стоять корабль
                                    self.markUnnecessaryCell();
                                    // обстрел клеток вокруг попадания
                                    self.getNeedCoordinatesShot();
                                    // производим новый выстрел
                                    setTimeout(function() {
                                        return self.shoot();
                                    }, 1000);
                                }
                            }
                            break;
                        // обстрелянная координата
                        case 3:
                        case 4:
                            if (player == user) {
                                text = 'Ахтунг!!! Вы так-то по этим координатам уже стреляли.';
                                self.showServiseText(text);
                            }
                            break;
                    }
                },

                getCoordinatesShot: function() {
                    var rnd, val;
                    if (comp.orderedShootMatrix.length != 0) {
                        if (comp.orderedShootMatrix.length > 10) {
                            rnd = getRandom(9);
                        } else {
                            rnd = getRandom(comp.orderedShootMatrix.length - 1);
                        }
                        val = comp.orderedShootMatrix.splice(rnd, 1)[0];
                    } else {
                        rnd = getRandom(comp.shootMatrix.length - 1),
                            val = comp.shootMatrix.splice(rnd, 1)[0];
                    }

                    coords = {
                        x: val[0],
                        y: val[1]
                    };

                    self.deleteElementMatrix(comp.shootMatrix, coords);

                    //console.log(val, comp.shootMatrix.length, comp.orderedShootMatrix.length);
                },

                getNeedCoordinatesShot: function() {
                    var kx = 0, ky = 0;
                    if (Object.keys(comp.firstHit).length === 0) {
                        comp.firstHit = coords;
                    } else {
                        comp.lastHit = coords;
                        kx = (Math.abs(comp.firstHit.x - comp.lastHit.x) == 1) ? 1 : 0;
                        ky = (Math.abs(comp.firstHit.y - comp.lastHit.y) == 1) ? 1 : 0;
                        comp.firstHit = comp.lastHit;
                        comp.lastHit = {};
                    }

                    if (coords.x > 0 && ky == 0) comp.needShootMatrix.push([coords.x - 1, coords.y]);
                    if (coords.x < 9 && ky == 0) comp.needShootMatrix.push([coords.x + 1, coords.y]);
                    if (coords.y > 0 && kx == 0) comp.needShootMatrix.push([coords.x, coords.y - 1]);
                    if (coords.y < 9 && kx == 0) comp.needShootMatrix.push([coords.x, coords.y + 1]);

                    for (var i = comp.needShootMatrix.length - 1; i >= 0; i--) {
                        var x = comp.needShootMatrix[i][0],
                            y = comp.needShootMatrix[i][1];
                        //удаляем точки, по которым уже проводился обстрел или стрельба не имеет смысла
                        if (user.matrix[x][y] != 0 && user.matrix[x][y] != 1) {
                            comp.needShootMatrix.splice(i,1);
                            self.deleteElementMatrix(comp.shootMatrix, coords);
                            if (comp.orderedShootMatrix.length != 0) {
                                self.deleteElementMatrix(comp.orderedShootMatrix, coords);
                            }
                        }
                    }
                    return;
                },

                needShoot: function() {
                    var val = comp.needShootMatrix.shift();
                    coords = {
                        x: val[0],
                        y: val[1]
                    }
                    // удаляем координаты по которым произошел выстрел
                    self.deleteElementMatrix(comp.shootMatrix, coords);
                    if (comp.orderedShootMatrix.length != 0) {
                        self.deleteElementMatrix(comp.orderedShootMatrix, coords);
                    }
                },

                markUnnecessaryCell: function() {
                    var icons	= user.field.querySelectorAll('.icon-field'),
                        points	= [
                            [coords.x - 1, coords.y - 1],
                            [coords.x - 1, coords.y + 1],
                            [coords.x + 1, coords.y - 1],
                            [coords.x + 1, coords.y + 1]
                        ];

                    for (var i = 0; i < 4; i++) {
                        var flag = true;
                        if (points[i][0] < 0 || points[i][0] > 9 || points[i][1] < 0 || points[i][1] > 9) continue; // за пределами игрового поля

                        // поиск совпадения с иконкой можно реализовать и через forEach, но в этом случае
                        // будет просмотренна вся коллекция иконок, к концу боя она может быть близка к 100
                        // при поиске через for(), можно прервать цикл при совпадении
                        for (var j = 0; j < icons.length; j++) {
                            var x = icons[j].style.top.slice(0, -2) / user.shipSide,
                                y = icons[j].style.left.slice(0, -2) / user.shipSide;
                            if (points[i][0] == x && points[i][1] == y) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag === false) continue;

                        var obj = {
                            x: points[i][0],
                            y: points[i][1]
                        }
                        self.showIcons(enemy, obj, 'shaded-cell');
                        user.matrix[obj.x][obj.y] = 2;

                        // удаляем из массивов выстрелов ненужные координаты
                        self.deleteElementMatrix(comp.shootMatrix, obj);
                        if (comp.needShootMatrix.length != 0) {
                            self.deleteElementMatrix(comp.needShootMatrix, obj);
                        }
                        if (comp.orderedShootMatrix.length != 0) {
                            self.deleteElementMatrix(comp.orderedShootMatrix, obj);
                        }
                    }
                },

                setEmptyCell: function(e) {
                    if (e.which != 3) return false;
                    e.preventDefault();
                    var coords = self.transformCoordinates(e, comp);

                    // прежде чем штриховать клетку, необходимо проверить пустая ли клетка
                    // если там уже есть закрашивание, то удалить его, если подбитая палуба или промах,
                    // то return
                    var ch = self.checkFieldCell(coords, 3);
                    if (ch) self.showIcons(enemy, coords, 'shaded-cell');
                },

                transformCoordinates: function(e, instance) {
                    // полифил для IE
                    if (!Math.trunc) {
                        Math.trunc = function(v) {
                            v = +v;
                            return (v - v % 1) || (!isFinite(v) || v === 0 ? v : v < 0 ? -0 : 0);
                        };
                    }

                    var obj = {};
                    obj.x = Math.trunc((e.pageY - instance.fieldX) / instance.shipSide),
                        obj.y = Math.trunc((e.pageX - instance.fieldY) / instance.shipSide);
                    return obj;
                },

                checkFieldCell: function(coords) {
                    var icons	= enemy.field.querySelectorAll('.icon-field'),
                        flag	= true,
                        isShadedCell;

                    [].forEach.call(icons, function(el) {
                        var x = el.style.top.slice(0, -2) / comp.shipSide,
                            y = el.style.left.slice(0, -2) / comp.shipSide;

                        if (coords.x == x && coords.y == y) {
                            isShadedCell = el.classList.contains('shaded-cell');
                            if (isShadedCell) el.parentNode.removeChild(el);
                            flag = false;
                        }
                    });
                    return flag;
                },

                showIcons: function(enemy, coords, iconClass) {
                    var div = document.createElement('div');
                    div.className = 'icon-field ' + iconClass;
                    div.style.cssText = 'left:' + (coords.y * enemy.shipSide) + 'px; top:' + (coords.x * enemy.shipSide) + 'px;';
                    enemy.field.appendChild(div);
                },

                showServiseText: function(text) {
                    srvText.innerHTML = '';
                    srvText.innerHTML = text;
                    /*setTimeout(function() {
                        tm = srvText.innerHTML = '';
                    }, 1000);*/
                },

                createShootMatrix: function(values) {
                    var type = values[0],
                        min = values[1],
                        max = values[2];

                    switch(type) {
                        case 1:
                            for (var i = min; i < max; i++) {
                                for(var j = min; j < max; j++) {
                                    comp.shootMatrix.push([i, j]);
                                }
                            }
                            break;
                        case 2:
                            for (var i = min; i < max; i++) {
                                comp.orderedShootMatrix.push([i, i]);
                            }
                            break;
                        case 3:
                            for (var i = min; i < max; i++) {
                                comp.orderedShootMatrix.push([max - i - 1, i]);
                            }
                            break;
                    };

                    function compareRandom(a, b) {
                        return Math.random() - 0.5;
                    }
                    //arr.sort(compareRandom);
                },

                deleteElementMatrix: function(array, obj) {
                    for (var i = array.length - 1; i >= 0; i--) {
                        if (array[i][0] == obj.x && array[i][1] == obj.y) {
                            var el = array.splice(i, 1);
                        }
                    }
                }
            };

            return ({
                battle: battle,
                init: battle.init
            });

        })();
        /////////////////////////////////////////

        function getElement(id) {
            return document.getElementById(id);
        }

        function getRandom(n) {
            return Math.floor(Math.random() * (n + 1));
        }

        function createMatrix() {
            var x = 10, y = 10, arr = [10];
            for (var i = 0; i < x; i++) {
                arr[i] = [10];
                for(var j = 0; j < y; j++) {
                    arr[i][j] = 0;
                }
            }
            return arr;
        }

        function getCoords(el) {
            var coords = el.getBoundingClientRect();
            return {
                top:	coords.top + pageYOffset,
                left:	coords.left + pageXOffset
            };
        }

        function printMatrix() {
            var print = '';
            for (var x = 0; x < 10; x++) {
                for (var y = 0; y < 10; y++) {
                    print += this.matrix[x][y];
                }
                print += '<br>';
            }
            getElement('matrix').innerHTML = print;
        }

    }

    ;(function(ELEMENT) {
        ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
        ELEMENT.closest = ELEMENT.closest || function closest(selector) {
            if (!this) return null;
            if (this.matches(selector)) return this;
            if (!this.parentElement) {return null}
            else return this.parentElement.closest(selector)
        };
    }(Element.prototype));


// end
});


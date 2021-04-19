/*******************************************************************/
/***                                                             ***/
/***   SquareMatrix.js - Library For Square Matrix Operations    ***/
/***                                                             ***/
/***   Version   : 0.3                                           ***/
/***   Date      : 01.01.2004                                    ***/
/***   Copyright : 2004 Adrian Zentner                           ***/
/***   Website   : http://www.adrian.zentner.name/               ***/
/***                                                             ***/
/***   This library is free software. It can be freely used as   ***/
/***   long as this this copyright notice is not removed.        ***/
/***                                                             ***/
/*******************************************************************/

function Matrix()
  {
     //--- begin methods declaration ---//

     Matrix.prototype.info                = info;
     Matrix.prototype.update              = update;
     Matrix.prototype.round               = round;
     Matrix.prototype.equals              = equals;
     Matrix.prototype.duplicate           = duplicate;
     Matrix.prototype.plus                = plus;
     Matrix.prototype.minus               = minus;
     Matrix.prototype.times               = times;
     Matrix.prototype.timesScalar         = timesScalar;
     Matrix.prototype.timesVector         = timesVector;
     Matrix.prototype.timesMatrix         = timesMatrix;
     Matrix.prototype.over                = over;
     Matrix.prototype.under               = under;
     Matrix.prototype.transpose           = transpose;
     Matrix.prototype.adjoint             = adjoint;
     Matrix.prototype.inverse             = inverse;
     Matrix.prototype.getDeterminant      = getDeterminant;
     Matrix.prototype.getRow              = getRow;
     Matrix.prototype.getColumn           = getColumn;
     Matrix.prototype.getDiagonal         = getDiagonal;
     Matrix.prototype.getSubmatrix        = getSubmatrix;
     Matrix.prototype.toArray             = toArray;
     Matrix.prototype.format              = format;
     Matrix.prototype.toString            = toString;
     Matrix.prototype.toXmlString         = toXmlString;
     Matrix.prototype.toFormatedString    = toFormatedString;
     Matrix.prototype.message             = message;

     //--- end methods declaration ---//

     //--- begin constructor ---//

     this.modus = "auto";
     switch(typeof(Matrix.arguments[0]))
       {
        case "number":
          return new Matrix(Matrix.arguments);
        break;
        case "object":
          if( Math.sqrt(Matrix.arguments[0].length) - Math.floor(Math.sqrt(Matrix.arguments[0].length)) == 0)
            {
               this.order = Math.sqrt(Matrix.arguments[0].length);
               this.e = createMatrix(this.order);
               for(var i=0; i<this.order; i++)
                 for(var j=0; j<this.order; j++)
                   this.e[i][j] = Number(Matrix.arguments[0][i*this.order + j]);
            }
          else
            {
               if(typeof(Matrix.arguments[0].length) == "undefined")
                 this.message("Error @ Matrix(): typeof parameters/array elements for square matrix constructor must be \"number\"");
               else
                 this.message("Error @ Matrix(): number of parameters/array length for square matrix constructor must be n x n");
               return null;
            }
        break;
        default:
          this.message("Error @ Matrix(): typeof Matrix() parameters must be \"number\" or \"array\"");
          return null;
        break;
       }

     this.update();
     this.status = "Info @ Matrix(): " + this.order + "  x " + this.order + " matrix successfully created (" + new Date().toLocaleString() + ")";

     //--- end constructor ---//

     //--- begin methods ---//

     function info()
       {
          var myString = "";

          myString += "JavaScript Square Matrix Library\n\n";
          myString += "Version: 0.3\n";
          myString += "Copyright: 2004 Adrian Zentner\n";
          myString += "Homepage: www.adrian.zentner.name\n";
          if(info.arguments[0] == true)
            window.alert(myString);

          return myString;
       }  // end method info()

     function update()
       {
          switch(this.order)
            {
             default:
               this.message("Warning @ Matrix(): Matrix.eXY is only supported for matrix order 9 or less");
             case 9:
               this.e19 =      this.e[0][8];
               this.e29 =      this.e[1][8];
               this.e39 =      this.e[2][8];
               this.e49 =      this.e[3][8];
               this.e59 =      this.e[4][8];
               this.e69 =      this.e[5][8];
               this.e79 =      this.e[6][8];
               this.e89 =      this.e[7][8];
               this.e91 =      this.e[8][0];
               this.e92 =      this.e[8][1];
               this.e93 =      this.e[8][2];
               this.e94 =      this.e[8][3];
               this.e95 =      this.e[8][4];
               this.e96 =      this.e[8][5];
               this.e97 =      this.e[8][6];
               this.e98 =      this.e[8][7];
               this.e99 =      this.e[8][8];
             case 8:
               this.e18 =      this.e[0][7];
               this.e28 =      this.e[1][7];
               this.e38 =      this.e[2][7];
               this.e48 =      this.e[3][7];
               this.e58 =      this.e[4][7];
               this.e68 =      this.e[5][7];
               this.e78 =      this.e[6][7];
               this.e81 =      this.e[7][0];
               this.e82 =      this.e[7][1];
               this.e83 =      this.e[7][2];
               this.e84 =      this.e[7][3];
               this.e85 =      this.e[7][4];
               this.e86 =      this.e[7][5];
               this.e87 =      this.e[7][6];
               this.e88 =      this.e[7][7];
             case 7:
               this.e17 =      this.e[0][6];
               this.e27 =      this.e[1][6];
               this.e37 =      this.e[2][6];
               this.e47 =      this.e[3][6];
               this.e57 =      this.e[4][6];
               this.e67 =      this.e[5][6];
               this.e71 =      this.e[6][0];
               this.e72 =      this.e[6][1];
               this.e73 =      this.e[6][2];
               this.e74 =      this.e[6][3];
               this.e75 =      this.e[6][4];
               this.e76 =      this.e[6][5];
               this.e77 =      this.e[6][6];
             case 6:
               this.e16 =      this.e[0][5];
               this.e26 =      this.e[1][5];
               this.e36 =      this.e[2][5];
               this.e46 =      this.e[3][5];
               this.e56 =      this.e[4][5];
               this.e61 =      this.e[5][0];
               this.e62 =      this.e[5][1];
               this.e63 =      this.e[5][2];
               this.e64 =      this.e[5][3];
               this.e65 =      this.e[5][4];
               this.e66 =      this.e[5][5];
             case 5:
               this.e15 =      this.e[0][4];
               this.e25 =      this.e[1][4];
               this.e35 =      this.e[2][4];
               this.e45 =      this.e[3][4];
               this.e51 =      this.e[4][0];
               this.e52 =      this.e[4][1];
               this.e53 =      this.e[4][2];
               this.e54 =      this.e[4][3];
               this.e55 =      this.e[4][4];
             case 4:
               this.e14 =      this.e[0][3];
               this.e24 =      this.e[1][3];
               this.e34 =      this.e[2][3];
               this.e41 =      this.e[3][0];
               this.e42 =      this.e[3][1];
               this.e43 =      this.e[3][2];
               this.e44 =      this.e[3][3];
             case 3:
               this.e13 =      this.e[0][2];
               this.e23 =      this.e[1][2];
               this.e31 =      this.e[2][0];
               this.e32 =      this.e[2][1];
               this.e33 =      this.e[2][2];
             case 2:
               this.e12 =      this.e[0][1];
               this.e21 =      this.e[1][0];
               this.e22 =      this.e[1][1];
             case 1:
               this.e11 =      this.e[0][0];
             break;
            }
       }  // end method update()

     function round()
       {
          if(typeof(round.arguments[0]) != "number")
            return this.round(4);
          else
            for(var i=0; i<this.order; i++)
              for(var j=0; j<this.order; j++)
                this.e[i][j] = Math.round(Math.pow(10, Math.round(Math.abs(round.arguments[0]))) * this.e[i][j]) / Math.pow(10, Math.round(Math.abs(round.arguments[0])));

          this.update();
       }  // end method round()

     function equals()
       {
          if(this.order != equals.arguments[0].order)
            {
              if(typeof(equals.arguments[0].order) == "undefined")
                this.message("Error @ Matrix.equals(): typeof parameter must be \"Matrix\"");
              else
                this.message("Warning @ Matrix.equals(): matrix orders do not agree");
              return false;
            }
          else
            {
               for(var i=0; i<this.order; i++)
                 for(var j=0; j<this.order; j++)
                   if(this.e[i][j] != equals.arguments[0].e[i][j])
                     return false;
            }

          return true;
       }  // end method equals()

     function duplicate()
       {
          return new Matrix(this.toArray());
       }  // end method duplicate()

     function plus()
       {
          var myArray = new Array();

          if(this.order != plus.arguments[0].order)
            {
              if(typeof(equals.arguments[0].order) == "undefined")
                this.message("Error @ Matrix.plus()/minus(): typeof parameter must be \"Matrix\"");
              else
                this.message("Error @ Matrix.plus()/minus(): matrix orders must agree");
              for(var i=0; i<Math.pow(this.order, 2); i++)
                myArray[i] = Number.NaN;
              return new Matrix(myArray);
            }
          else
            for(var i=0; i<this.order; i++)
              for(var j=0; j<this.order; j++)
                myArray[i*this.order + j] = this.e[i][j] + plus.arguments[0].e[i][j];

          return new Matrix(myArray);
       }  // end method plus()

     function minus()
       {
          return this.plus(minus.arguments[0].times(-1));
       }  // end method minus()

     function times()
       {
          switch(typeof(times.arguments[0]))
            {
             case "number":
               return this.timesScalar(times.arguments[0]);
             break;
             case "object":
               if(typeof(times.arguments[0].length) == "number")
                 return this.timesVector(times.arguments[0]);
               if(typeof(times.arguments[0].order) == "number")
                 return this.timesMatrix(times.arguments[0]);
             default:
               this.message("Error @ Matrix.times(): typeof parameter must be \"number\", \"Array\" or \"Matrix\"");
             break;
            }

          return null;
       }  // end method times()

     function timesScalar()
       {
          var myArray = new Array();

          if(typeof(timesScalar.arguments[0]) != "number")
            {
               this.message("Error @ Matrix.timesScalar(): typeof parameter must be \"number\"");
               for(var i=0; i<Math.pow(this.order, 2); i++)
                 myArray[i] = Number.NaN;
               return new Matrix(myArray);
            }
          else
            {
               for(var i=0; i<this.order; i++)
                 for(var j=0; j<this.order; j++)
                   myArray[i*this.order + j] = timesScalar.arguments[0] * this.e[i][j];
            }

          return new Matrix(myArray);
       }  // end method timesScalar()

     function timesVector()
       {
          var myArray = new Array();

          if(typeof(timesVector.arguments[0].length) != "number")
            {
               this.message("Error @ Matrix.timesVector(): typeof parameter must be \"Array\"");
               for(var i=0; i<this.order; i++)
                 myArray[i] = Number.NaN;
               return myArray;
            }
          else
            {
               if(this.order != timesVector.arguments[0].length)
                 {
                    this.message("Error @ Matrix.timesVector(): vector length must be equal to matrix order");
                    for(var i=0; i<this.order; i++)
                      myArray[i] = Number.NaN;
                    return myArray;
                 }
               else
                 {
                    for(var i=0; i<this.order; i++)
                      myArray[i] = 0;
                    for(var i=0; i<this.order; i++)
                      for(var j=0; j<this.order; j++)
                        myArray[i] += this.e[i][j] * timesVector.arguments[0][j];
                 }
            }

          return myArray;
       }  // end method timesVector()

     function timesMatrix()
       {
          var myArray = new Array();

          if(typeof(timesMatrix.arguments[0].order) != "number")
            {
               this.message("Error @ Matrix.timesMatrix(): typeof parameter must be \"Matrix\"");
               for(var i=0; i<Math.pow(this.order, 2); i++)
                 myArray[i] = Number.NaN;
               return new Matrix(myArray);
            }
          else
            {
               if(this.order != timesMatrix.arguments[0].order)
                 {
                    this.message("Error @ Matrix.timesMatrix(): matrix orders must agree");
                    for(var i=0; i<Math.pow(this.order, 2); i++)
                      myArray[i] = Number.NaN;
                    return new Matrix(myArray);
                 }
               else
                 {
                    for(var i=0; i<Math.pow(this.order, 2); i++)
                      myArray[i] = 0;
                    for(var i=0; i<this.order; i++)
                      for(var j=0; j<this.order; j++)
                        for(var k=0; k<this.order; k++)
                          myArray[k*this.order + j] += this.e[k][i] * Number(timesMatrix.arguments[0].e[i][j]);
                 }
            }

          return new Matrix(myArray);
       }  // end method timesMatrix()

     function over()
       {
          return this.times(over.arguments[0].inverse());
       }  // end method over()

     function under()
       {
          return this.inverse().times(under.arguments[0]);
       }  // end method under()

     function transpose()
       {
          var myArray = new Array();

          for(var i=0; i<this.order; i++)
            for(var j=0; j<this.order; j++)
              myArray[i*this.order + j] = this.e[j][i];

          return new Matrix(myArray);
       }  // end method transpose()

     function adjoint()
       {
          var myArray = new Array();

          for(var i=0; i<this.order; i++)
            for(var j=0; j<this.order; j++)
              myArray[i*this.order + j] = Math.pow(-1, i+j) * this.getSubmatrix(i+1, j+1).getDeterminant();

          return new Matrix(myArray);
       }  // end method adjoint()

     function inverse()
       {
          var myArray = new Array();

          if(this.getDeterminant() == 0)
            {
               this.message("Warning @ Matrix.inverse(): matrix is singular");
               for(var i=0; i<Math.pow(this.order, 2); i++)
                 myArray[i] = Number.NaN;
               return new Matrix(myArray);
            }

          return this.adjoint().transpose().times(1/this.getDeterminant());
       }  // end method inverse()

     function getDeterminant()
       {
          var determinant = 0;

          switch(this.order)
            {
             case 1:
               return this.e[0][0];
             break;
             case 2:
               return  this.e[0][0]*this.e[1][1] - this.e[0][1]*this.e[1][0];
             break;
             case 3:
               return +(this.e[0][0]*this.e[1][1]*this.e[2][2] + this.e[1][0]*this.e[2][1]*this.e[0][2] + this.e[0][1]*this.e[1][2]*this.e[2][0])
                      -(this.e[2][0]*this.e[1][1]*this.e[0][2] + this.e[1][0]*this.e[0][1]*this.e[2][2] + this.e[2][1]*this.e[1][2]*this.e[0][0]);
             break;
             default:
               for(var i=0; i<this.order; i++)
                 determinant += Math.pow(-1, i) * this.e[0][i] * this.getSubmatrix(1, i+1).getDeterminant();
             break;
            }

          return determinant;
       }  // end method getDeterminant()

     function getRow()
       {
          var myArray = new Array();

          if((typeof(getRow.arguments[0]) != "number")      ||
             (Math.round(getRow.arguments[0]) > this.order) ||
             (Math.round(getRow.arguments[0]) <= 0)          )
            {
               this.message("Error @ Matrix.getRow(): wrong parameter definition");
               for(var i=0; i<this.order; i++)
                 myArray[i] = Number.NaN;
               return myArray;
            }
          else
            for(var i=0; i<this.order; i++)
              myArray[i] = this.e[Math.round(getRow.arguments[0])-1][i];

          return myArray;
       }  // end method getRow()

     function getColumn()
       {
          var myArray = new Array();

          if((typeof(getColumn.arguments[0]) != "number")      ||
             (Math.round(getColumn.arguments[0]) > this.order) ||
             (Math.round(getColumn.arguments[0]) <= 0)          )
            {
               this.message("Error @ Matrix.getColumn(): wrong parameter definition");
               for(var i=0; i<this.order; i++)
                 myArray[i] = Number.NaN;
               return myArray;
            }
          else
            for(var i=0; i<this.order; i++)
              myArray[i] = this.e[i][Math.round(getColumn.arguments[0])-1];

          return myArray;
       }  // end method getColumn()

     function getDiagonal()
       {
          var myArray = new Array();

          if(getDiagonal.arguments[0] != false)
            for(var i=0; i<this.order; i++)
              myArray[i] = this.e[i][i];
          else
            for(var i=0; i<this.order; i++)
              myArray[i] = this.e[i][this.order-1-i];

          return myArray;
       }  // end method getDiagonal()

     function getSubmatrix()
       {
          var myArray = new Array();

          myArray[0] = 1;

          if((typeof(getSubmatrix.arguments[0]) != "number")      ||
             (typeof(getSubmatrix.arguments[1]) != "number")      ||
             (Math.round(getSubmatrix.arguments[0]) > this.order) ||
             (Math.round(getSubmatrix.arguments[1]) > this.order) ||
             (Math.round(getSubmatrix.arguments[0]) <= 0)         ||
             (Math.round(getSubmatrix.arguments[1]) <= 0)          )
            {
               this.message("Error @ Matrix.getSubmatrix(): wrong parameter definition");
               for(var i=0; i<Math.pow(this.order-1, 2); i++)
                 myArray[i] = Number.NaN;
               return new Matrix(myArray);
            }
          else
            for(var i=0; i<this.order-1; i++)
              for(var j=0; j<this.order-1; j++)
                myArray[i*(this.order-1) + j] = this.e[i + ((i >= (Math.round(getSubmatrix.arguments[0])-1)) ? 1 : 0)][j + ((j >= (Math.round(getSubmatrix.arguments[1])-1)) ? 1 : 0)];

          return new Matrix(myArray);
       }  // end method getSubmatrix()

     function toArray()
       {
          var myArray = new Array();

          for(var i=0; i<this.order; i++)
            for(var j=0; j<this.order; j++)
              myArray[i*this.order + j] = this.e[i][j];

          return myArray;
       }  // end method toArray()

     function format()
       {
          var isInteger = true;
          var minLength = 0;
          var maxLength = 0;
          var myArray   = new Array();
          var myMatrix  = this.duplicate();

          if(typeof(format.arguments[0]) != "number")
            myMatrix.round(4);
          else
            myMatrix.round(format.arguments[0]);

          for(var i=0; i<myMatrix.order; i++)
            for(var j=0; j<myMatrix.order; j++)
              {
                 var element = String(myMatrix.e[i][j]);

                 if(element.indexOf(".") != -1)
                   isInteger = false;
                 if(element.indexOf(".") == -1)
                   element += ".";
                 maxLength = Math.max(maxLength, element.slice(0, element.indexOf(".")).length);
                 minLength = Math.max(minLength, element.length - element.indexOf("."));
              }

          for(var i=0; i<myMatrix.order; i++)
            for(var j=0; j<myMatrix.order; j++)
              {
                 var element = String(myMatrix.e[i][j]);

                 if(element.indexOf(".") == -1)
                   element += ".";
                 while(element.indexOf(".") < maxLength)
                   element = " " + element;
                 if(isInteger)
                   element = element.slice(0, element.length-1);
                 else
                   while(element.length - element.indexOf(".") < minLength)
                     element = element + "0";

                 myArray[i*myMatrix.order + j] = element;
              }

          return myArray;
       }  // end method format()

     function toString()
       {
          var myString = "";

          if(typeof(toString.arguments[0]) != "number")
            return this.toString(4);
          else
            {
               if(toString.arguments[0] < 0)
                 return this.toArray().join(" ");
               else
                 {
                    var myArray = this.format(toString.arguments[0]);
                    for(var i=0; i<this.order; i++)
                      {
                         for(var j=0; j<this.order; j++)
                           myString += " " + myArray[i*this.order + j];
                         myString += "\n";
                      }
                 }
            }

          return myString;
       }  // end method toString()

     function toXmlString()
       {
          if(typeof(toXmlString.arguments[1]) == "number")
            var decimalPlaces = Math.round(Math.abs(toXmlString.arguments[1]));
          else
            var decimalPlaces = 4;

          if(toXmlString.arguments[0] == false)
            return this.toFormatedString("<mrow>\n  <mfenced open=\"[\" close=\"]\">\n    <mtable>\n", "      <mtr>\n", "        <mtd><mn>", decimalPlaces, "</mn></mtd>\n", false, "      </mtr>\n", false, "    </mtable>\n  </mfenced>\n</mrow>\n");
          else
            return this.toFormatedString("<math xmlns=\"http://www.w3.org/1998/Math/MathML\">\n<mrow>\n  <mfenced open=\"[\" close=\"]\">\n    <mtable>\n", "      <mtr>\n", "        <mtd><mn>", decimalPlaces, "</mn></mtd>\n", false, "      </mtr>\n", false, "    </mtable>\n  </mfenced>\n</mrow>\n</math>\n");

       }  // end method toXmlString()

     function toFormatedString()
       {
          if((typeof(toFormatedString.arguments[0]) != "string")  ||
             (typeof(toFormatedString.arguments[1]) != "string")  ||
             (typeof(toFormatedString.arguments[2]) != "string")  ||
             (typeof(toFormatedString.arguments[3]) != "number")  ||
             (typeof(toFormatedString.arguments[4]) != "string")  ||
             (typeof(toFormatedString.arguments[5]) != "boolean") ||
             (typeof(toFormatedString.arguments[6]) != "string")  ||
             (typeof(toFormatedString.arguments[7]) != "boolean") ||
             (typeof(toFormatedString.arguments[8]) != "string")   )
            return this.toFormatedString("<table style=\"text-align:right;border-left:1px solid black;border-right:1px solid black;\">\n",
                                         "  <tr>\n",
                                         "    <td>&nbsp;",
                                         4,
                                         "&nbsp;</td>\n", false,
                                         "  </tr>\n", false,
                                         "</table>\n"
                                        );

          var  myString = toFormatedString.arguments[0];

          for(var i=0; i<this.order; i++)
            {
               var myArray = this.format(toFormatedString.arguments[3]);
               myString += toFormatedString.arguments[1];
               for(var j=0; j<this.order; j++)
                 {
                    myString += toFormatedString.arguments[2];
                    myString += myArray[i*this.order + j];
                    if( (toFormatedString.arguments[5]) && (j == this.order-1) )
                      break;
                    else
                      myString += toFormatedString.arguments[4];
                 }
               if( (toFormatedString.arguments[7]) && (i == this.order-1) )
                 break;
               else
                 myString += toFormatedString.arguments[6];
            }

            myString += toFormatedString.arguments[8];

          return myString;
       }  // end method toFormatedString()

     function message()
       {
          this.status = message.arguments[0];

          switch(this.modus.toLowerCase())
            {
             case "none":
             break;
             case "status":
               window.status = this.status;
             break;
             case "alert":
               window.alert(this.status);
             break;
             case "auto":
               switch(this.status.slice(0, 4).toLowerCase())
                 {
                  case "info":
                  break;
                  case "warn":
                    window.status = this.status;
                  break;
                  case "unkn":
                  case "erro":
                    window.alert(this.status);
                  break;
                  default:
                    var messageType = this.status.slice(0, this.status.indexOf(" "));
                    var messageStatus = this.status;
                    var messageCaller = String(message.caller);
                    this.message("Error @ Matrix.message(): \"" + messageType + "\" is not a valid message type.\n\nValid message types are \"Info\", \"Warning\" and \"Error\".");
                    if(messageCaller == "null")
                      messageCaller = "noFunctionCaller";
                    else
                      messageCaller = messageCaller.slice(String("function ").length, messageCaller.indexOf("(")) + "()";
                    this.status = messageStatus;
                    this.message("Unknown @ " + messageCaller + ": " + this.status);
                  break;
                 }
             break;
             default:
               eval(this.modus + "(this.status)");
             break;
            }
       }  // end method message()

     //--- end methods ---//

     //--- begin functions ---//

     function createMatrix()
       {
          var myArray = new Array(createMatrix.arguments[0]);

          for(var i=0; i<createMatrix.arguments[0]; i++)
            myArray[i] = new Array(createMatrix.arguments[0]);

          return myArray;
       }  // end function createMatrix()

     //--- end functions ---//

  }  // end class Matrix()
  
if(typeof module === 'object'){
	module.exports = Matrix;
}
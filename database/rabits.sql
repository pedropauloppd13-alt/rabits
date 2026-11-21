-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema rabits
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema rabits
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `rabits` ;
USE `rabits` ;

-- -----------------------------------------------------
-- Table `rabits`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rabits`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `dataNascimento` DATE NULL,
  `senha` VARCHAR(255) NOT NULL,
  `pesoCorporal` FLOAT UNSIGNED NULL,
  `altura` FLOAT UNSIGNED NULL,
  `email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rabits`.`ofensiva`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rabits`.`ofensiva` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `recorde` INT UNSIGNED NULL DEFAULT 0,
  `intervaloDias` INT UNSIGNED NOT NULL DEFAULT 1,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `usuario_id_UNIQUE` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_ofensiva_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `rabits`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rabits`.`fichaTreino`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rabits`.`fichaTreino` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_fichaTreino_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_fichaTreino_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `rabits`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rabits`.`atividade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rabits`.`atividade` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `series` INT UNSIGNED NULL,
  `nome` VARCHAR(100) NOT NULL,
  `tempoDescansoSegundos` INT UNSIGNED NULL,
  `exercicio_id` INT UNSIGNED NULL,
  `peso` FLOAT UNSIGNED NULL,
  `repeticoes` INT UNSIGNED NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rabits`.`atividade_has_fichaTreino`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rabits`.`atividade_has_fichaTreino` (
  `atividade_id` INT NOT NULL,
  `fichaTreino_id` INT NOT NULL,
  PRIMARY KEY (`atividade_id`, `fichaTreino_id`),
  INDEX `fk_atividade_has_fichaTreino_fichaTreino1_idx` (`fichaTreino_id` ASC) VISIBLE,
  INDEX `fk_atividade_has_fichaTreino_atividade1_idx` (`atividade_id` ASC) VISIBLE,
  CONSTRAINT `fk_atividade_has_fichaTreino_atividade1`
    FOREIGN KEY (`atividade_id`)
    REFERENCES `rabits`.`atividade` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_atividade_has_fichaTreino_fichaTreino1`
    FOREIGN KEY (`fichaTreino_id`)
    REFERENCES `rabits`.`fichaTreino` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rabits`.`dia_has_ofensiva`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rabits`.`dia_has_ofensiva` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dia_treino` DATETIME NOT NULL,
  `ofensiva_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_dia_has_ofensiva_ofensiva1_idx` (`ofensiva_id` ASC) VISIBLE,
  CONSTRAINT `fk_dia_has_ofensiva_ofensiva1`
    FOREIGN KEY (`ofensiva_id`)
    REFERENCES `rabits`.`ofensiva` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;